// app/api/forums/route.ts
import { createConnection } from "@/lib/db";

// GET: fetch posts with nested comments and replies
export async function GET(req: Request) {
  const connection = await createConnection();
  try {
    // 1) Fetch posts
    const posts: any[] = await new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT
          fq.id         AS post_id,
          fq.title      AS title,
          fq.text       AS post_text,
          fq.date_made  AS post_date,
          fq.user_id    AS user_id,
          ui.firstName  AS firstName,
          ui.lastName   AS lastName
        FROM forum_question fq
        JOIN user_information ui
          ON fq.user_id = ui.id
        ORDER BY fq.date_made DESC;
        `,
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    // 2) Fetch top-level comments (exclude replies)
    const comments: any[] = await new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT
          fr.id           AS comment_id,
          fr.text         AS comment_text,
          fr.date_made    AS comment_date,
          fr.question_id  AS post_id,
          pr.user_id      AS user_id,
          ui.firstName    AS firstName,
          ui.lastName     AS lastName
        FROM forum_response fr
        JOIN posted_response pr
          ON fr.id = pr.response_id
        JOIN user_information ui
          ON pr.user_id = ui.id
        LEFT JOIN r_response rr
          ON fr.id = rr.child_response_id
        WHERE rr.child_response_id IS NULL
        ORDER BY fr.date_made ASC;
        `,
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    // 3) Fetch replies
    const replies: any[] = await new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT
          child.id               AS reply_id,
          child.text             AS reply_text,
          child.date_made        AS reply_date,
          r.parent_response_id   AS parent_comment_id,
          pr.user_id             AS user_id,
          ui.firstName           AS firstName,
          ui.lastName            AS lastName
        FROM r_response r
        JOIN forum_response child
          ON r.child_response_id = child.id
        JOIN posted_response pr
          ON child.id = pr.response_id
        JOIN user_information ui
          ON pr.user_id = ui.id
        ORDER BY child.date_made ASC;
        `,
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    // 4) Nest comments and replies under each post
    const structured = posts.map(p => ({
      id: p.post_id,
      title: p.title,
      text: p.post_text,
      user: `${p.firstName} ${p.lastName}`,
      user_id: p.user_id,
      date_made: p.post_date,
      comments: comments
        .filter(c => c.post_id === p.post_id)
        .map(c => ({
          id: c.comment_id,
          user: `${c.firstName} ${c.lastName}`,
          content: c.comment_text,
          user_id: c.user_id,
          date_made: c.comment_date,
          replies: replies
            .filter(r => r.parent_comment_id === c.comment_id)
            .map(r => ({
              id: r.reply_id,
              user: `${r.firstName} ${r.lastName}`,
              content: r.reply_text,
              user_id: r.user_id,
              date_made: r.reply_date,
            })),
        })),
    }));

    return new Response(JSON.stringify({ posts: structured }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Forums GET error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch posts" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    connection.end();
  }
}

// POST: create a post, comment, or reply, using NOW() for full DATETIME
export async function POST(req: Request) {
  const { type, userId, title, text, postId, commentId, content } = await req.json();
  const connection = await createConnection();

  try {
    if (type === "post") {
      await new Promise((resolve, reject) => {
        connection.query(
          `INSERT INTO forum_question
             (user_id, title, text, date_made, solved)
           VALUES (?, ?, ?, NOW(), 0);`,
          [userId, title, text],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      return new Response(JSON.stringify({ response: "Post Created" }), { status: 200 });
    }

    if (type === "comment") {
      const result: any = await new Promise((resolve, reject) => {
        connection.query(
          `INSERT INTO forum_response
             (text, date_made, question_id)
           VALUES (?, NOW(), ?);`,
          [content, postId],
          (err, results) => (err ? reject(err) : resolve(results))
        );
      });
      await new Promise((resolve, reject) => {
        connection.query(
          `INSERT INTO posted_response
             (user_id, response_id)
           VALUES (?, ?);`,
          [userId, result.insertId],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      return new Response(JSON.stringify({ response: "Comment Created" }), { status: 200 });
    }

    if (type === "reply") {
      const result: any = await new Promise((resolve, reject) => {
        connection.query(
          `INSERT INTO forum_response
             (text, date_made, question_id)
           VALUES (?, NOW(), ?);`,
          [content, postId],
          (err, results) => (err ? reject(err) : resolve(results))
        );
      });
      const rid = result.insertId;
      await new Promise((resolve, reject) => {
        connection.query(
          `INSERT INTO posted_response
             (user_id, response_id)
           VALUES (?, ?);`,
          [userId, rid],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      await new Promise((resolve, reject) => {
        connection.query(
          `INSERT INTO r_response
             (parent_response_id, child_response_id)
           VALUES (?, ?);`,
          [commentId, rid],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      return new Response(JSON.stringify({ response: "Reply Created" }), { status: 200 });
    }

    return new Response(
      JSON.stringify({ response: "Invalid request type" }),
      { status: 400 }
    );
  } catch (error) {
    console.error("Forums POST error:", error);
    return new Response(
      JSON.stringify({ response: "Error creating forum content" }),
      { status: 500 }
    );
  } finally {
    connection.end();
  }
}

// DELETE: remove a post, comment, or reply and return in every branch
export async function DELETE(req: Request) {
  const { type, id } = await req.json();
  const connection = await createConnection();

  try {
    if (type === "post") {
      // delete replies linked to post
      await new Promise((resolve, reject) => {
        connection.query(
          `DELETE r FROM r_response r
           JOIN forum_response fr
             ON r.child_response_id = fr.id
           WHERE fr.question_id = ?;`,
          [id],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      // delete posted_response for those responses
      await new Promise((resolve, reject) => {
        connection.query(
          `DELETE pr FROM posted_response pr
           JOIN forum_response fr
             ON pr.response_id = fr.id
           WHERE fr.question_id = ?;`,
          [id],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      // delete all responses
      await new Promise((resolve, reject) => {
        connection.query(
          `DELETE FROM forum_response WHERE question_id = ?;`,
          [id],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      // delete the question
      await new Promise((resolve, reject) => {
        connection.query(
          `DELETE FROM forum_question WHERE id = ?;`,
          [id],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      return new Response(
        JSON.stringify({ response: "Post Deletion Successful" }),
        { status: 200 }
      );
    }

    if (type === "comment") {
      // delete child replies
      await new Promise((resolve, reject) => {
        connection.query(
          `DELETE FROM r_response WHERE parent_response_id = ?;`,
          [id],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      // delete posted_response
      await new Promise((resolve, reject) => {
        connection.query(
          `DELETE FROM posted_response WHERE response_id = ?;`,
          [id],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      // delete the comment itself
      await new Promise((resolve, reject) => {
        connection.query(
          `DELETE FROM forum_response WHERE id = ?;`,
          [id],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      return new Response(
        JSON.stringify({ response: "Comment Deletion Successful" }),
        { status: 200 }
      );
    }

    if (type === "reply") {
      // delete reply link
      await new Promise((resolve, reject) => {
        connection.query(
          `DELETE FROM r_response WHERE child_response_id = ?;`,
          [id],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      // delete posted_response
      await new Promise((resolve, reject) => {
        connection.query(
          `DELETE FROM posted_response WHERE response_id = ?;`,
          [id],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      // delete the reply
      await new Promise((resolve, reject) => {
        connection.query(
          `DELETE FROM forum_response WHERE id = ?;`,
          [id],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      return new Response(
        JSON.stringify({ response: "Reply Deletion Successful" }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ response: "Invalid delete type" }),
      { status: 400 }
    );
  } catch (error) {
    console.error("Forums DELETE error:", error);
    return new Response(
      JSON.stringify({ response: "Deletion Error" }),
      { status: 500 }
    );
  } finally {
    connection.end();
  }
}

// OPTIONS: enable CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
