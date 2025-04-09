import { createConnection } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  const connection = await createConnection();

  try {
    if (body.type === 'post') {
      const { userId, title, text } = body;
      const date_made = new Date().toISOString().split('T')[0];

      await new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO forum_question (user_id, title, text, date_made, solved) VALUES (?, ?, ?, ?, 0);',
          [userId, title, text, date_made],
          (err) => (err ? reject(err) : resolve(null))
        );
      });

      return new Response(JSON.stringify({ response: "Post Created" }), { status: 200 });
    }

    if (body.type === 'comment') {
      const { postId, userId, content } = body;
      const date_made = new Date().toISOString().split('T')[0];

      const result: any = await new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO forum_response (text, date_made, question_id) VALUES (?, ?, ?);',
          [content, date_made, postId],
          (err, results) => (err ? reject(err) : resolve(results))
        );
      });

      const commentId = result.insertId;

      await new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO posted_response (user_id, response_id) VALUES (?, ?);',
          [userId, commentId],
          (err) => (err ? reject(err) : resolve(null))
        );
      });

      return new Response(JSON.stringify({ response: "Comment Created" }), { status: 200 });
    }

    if (body.type === 'reply') {
      const { postId, commentId, userId, content } = body;
      const date_made = new Date().toISOString().split('T')[0];

      const result: any = await new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO forum_response (text, date_made, question_id) VALUES (?, ?, ?);',
          [content, date_made, postId],
          (err, results) => (err ? reject(err) : resolve(results))
        );
      });

      const replyId = result.insertId;

      await new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO posted_response (user_id, response_id) VALUES (?, ?);',
          [userId, replyId],
          (err) => (err ? reject(err) : resolve(null))
        );
      });

      await new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO r_response (parent_response_id, child_response_id) VALUES (?, ?);',
          [commentId, replyId],
          (err) => (err ? reject(err) : resolve(null))
        );
      });

      return new Response(JSON.stringify({ response: "Reply Created" }), { status: 200 });
    }

    return new Response(JSON.stringify({ response: "Invalid request type" }), { status: 400 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ response: "Error creating forum content" }), { status: 500 });
  } finally {
    connection.end();
  }
}

export async function GET(req: Request) {
  const connection = await createConnection();

  try {
    const posts = await new Promise<any[]>((resolve, reject) => {
      connection.query(`
        SELECT 
          fq.id AS post_id, fq.title, fq.text AS post_text, fq.date_made AS post_date, fq.user_id, ui.firstName, ui.lastName
        FROM forum_question fq
        JOIN user_information ui ON fq.user_id = ui.id
        ORDER BY fq.date_made DESC;
      `, (err, results) => (err ? reject(err) : resolve(results)));
    });

    const comments = await new Promise<any[]>((resolve, reject) => {
      connection.query(`
        SELECT 
          fr.id AS comment_id, fr.text AS comment_text, fr.question_id, pr.user_id, ui.firstName, ui.lastName
        FROM forum_response fr
        JOIN posted_response pr ON fr.id = pr.response_id
        JOIN user_information ui ON pr.user_id = ui.id;
      `, (err, results) => (err ? reject(err) : resolve(results)));
    });

    const replies = await new Promise<any[]>((resolve, reject) => {
      connection.query(`
        SELECT 
          child.id AS reply_id, child.text AS reply_text, r.parent_response_id, pr.user_id, ui.firstName, ui.lastName
        FROM r_response r
        JOIN forum_response child ON r.child_response_id = child.id
        JOIN posted_response pr ON child.id = pr.response_id
        JOIN user_information ui ON pr.user_id = ui.id;
      `, (err, results) => (err ? reject(err) : resolve(results)));
    });

    const structuredPosts = posts.map(post => ({
      id: post.post_id,
      title: post.title,
      text: post.post_text,
      user: `${post.firstName} ${post.lastName}`,
      user_id: post.user_id,
      date_made: post.post_date,
      comments: comments
        .filter(comment => comment.question_id === post.post_id)
        .map(comment => ({
          id: comment.comment_id,
          user: `${comment.firstName} ${comment.lastName}`,
          content: comment.comment_text,
          user_id: comment.user_id,
          replies: replies
            .filter(reply => reply.parent_response_id === comment.comment_id)
            .map(reply => ({
              id: reply.reply_id,
              user: `${reply.firstName} ${reply.lastName}`,
              content: reply.reply_text,
              user_id: reply.user_id,
            })),
        })),
    }));

    return new Response(JSON.stringify({ posts: structuredPosts }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch posts" }), { status: 500 });
  } finally {
    connection.end();
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
  });
}

export async function DELETE(req: Request) {
  const { type, id } = await req.json();
  const connection = await createConnection();

  try {
    if (type === 'post') {
      // Step 1: Delete r_response links (replies) linked to post comments
      await new Promise((resolve, reject) => {
        connection.query(`
          DELETE r FROM r_response r
          JOIN forum_response child ON r.child_response_id = child.id
          WHERE child.question_id = ?;
        `, [id], (err) => (err ? reject(err) : resolve(null)));
      });

      // Step 2: Delete posted_response entries
      await new Promise((resolve, reject) => {
        connection.query(`
          DELETE pr FROM posted_response pr
          JOIN forum_response fr ON pr.response_id = fr.id
          WHERE fr.question_id = ?;
        `, [id], (err) => (err ? reject(err) : resolve(null)));
      });

      // Step 3: Delete forum_response (comments + replies)
      await new Promise((resolve, reject) => {
        connection.query(
          'DELETE FROM forum_response WHERE question_id = ?;',
          [id],
          (err) => (err ? reject(err) : resolve(null))
        );
      });

      // Step 4: Delete the forum_question (post)
      await new Promise((resolve, reject) => {
        connection.query(
          'DELETE FROM forum_question WHERE id = ?;',
          [id],
          (err) => (err ? reject(err) : resolve(null))
        );
      });

      return new Response(JSON.stringify({ response: "Post Deletion Successful" }), { status: 200 });
    }

    if (type === 'comment') {
      // Delete reply links to this comment
      await new Promise((resolve, reject) => {
        connection.query('DELETE FROM r_response WHERE parent_response_id = ?;', [id], (err) => (err ? reject(err) : resolve(null)));
      });

      // Delete user ownership
      await new Promise((resolve, reject) => {
        connection.query('DELETE FROM posted_response WHERE response_id = ?;', [id], (err) => (err ? reject(err) : resolve(null)));
      });

      // Delete the comment itself
      await new Promise((resolve, reject) => {
        connection.query('DELETE FROM forum_response WHERE id = ?;', [id], (err) => (err ? reject(err) : resolve(null)));
      });

      return new Response(JSON.stringify({ response: "Comment Deletion Successful" }), { status: 200 });
    }

    if (type === 'reply') {
      // Delete reply link
      await new Promise((resolve, reject) => {
        connection.query('DELETE FROM r_response WHERE child_response_id = ?;', [id], (err) => (err ? reject(err) : resolve(null)));
      });

      // Delete user ownership
      await new Promise((resolve, reject) => {
        connection.query('DELETE FROM posted_response WHERE response_id = ?;', [id], (err) => (err ? reject(err) : resolve(null)));
      });

      // Delete reply itself
      await new Promise((resolve, reject) => {
        connection.query('DELETE FROM forum_response WHERE id = ?;', [id], (err) => (err ? reject(err) : resolve(null)));
      });

      return new Response(JSON.stringify({ response: "Reply Deletion Successful" }), { status: 200 });
    }

    return new Response(JSON.stringify({ response: "Invalid delete type" }), { status: 400 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ response: "Deletion Error" }), { status: 500 });
  } finally {
    connection.end();
  }
}
