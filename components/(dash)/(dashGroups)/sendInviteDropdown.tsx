"use client"

import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import getUsersLike from "@/lib/getUsers";

export default function InviteComboBox({ groupId, setSelectedId, reload } : { string, any, any }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [userList, setUserList] = React.useState([]);

  useEffect(() => {
    const getUsers = async () => {
      console.log(groupId);
      let users = await getUsersLike(groupId);
      if (users.users != "None") {
          users = users.users;
          let newUsers = [];
          for (let i in users) {
              newUsers.push({value: "" + users[i].id, label: users[i].username})
          }
          setUserList(newUsers);
      }
    }

    getUsers();
    setValue("");
  }, [reload])

  useEffect(() => {
    console.log(value);
    setSelectedId(value);
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? userList.find((user) => user.value === value)?.label
            : "Select user..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search user..." className="h-9" />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {userList.map((user) => (
                <CommandItem
                  key={user.value}
                  value={user.label} // 👈 use label for searching
                  onSelect={(currentValue) => {
                    const matched = userList.find((u) => u.label === currentValue);
                    setValue(matched?.value ?? ""); // still store the ID in `value`
                    setOpen(false);
                }}
                >
                  <div className="flex flex-col">
                    {user.label}
                    <p className="opacity-50">Id: {user.value}</p>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto",
                      value === user.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
