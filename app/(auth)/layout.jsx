"use client";

import React, { useState } from "react";
import { HashtagIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@heroui/react";
import { getGroupByCode } from "../services/groupService";

const AuthLayout = ({ children }) => {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!code) return;

    if (code.length != 7) {
      toast.error("Please enter a valid code.");
      return;
    }

    try {
      const group = await getGroupByCode(code);

      if (group) {
        // Redirecționează utilizatorul către pagina grupului
        router.push(`/group-room/${group._id}`);
      } else {
        toast.error(
          "Sorry, there is no such group right now. Please try again!"
        );
        setCode("");
        return;
      }
    } catch (error) {
      console.error("Error joining group:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col w-full md:flex-row overflow-auto">
      {/* Fixed Left Section */}
      <div className="flex flex-col md:items-start px-8 pt-16 pb-10 md:h-screen md:w-1/2  bg-primary justify-center md:px-16 md:py-16 text-white dark:text-gray-900">
        <h1 className="font-semibold text-[24px] md:text-[36px] mb-3">
          Joining a private group?
        </h1>
        <h2 className="font-medium text-[18px] md:text-[20px] mb-6">
          No account needed
        </h2>
        <form className="flex items-center p-2 bg-gray-100 dark:bg-gray-900 rounded-xl drop-shadow-md w-full max-w-xs">
          <HashtagIcon className="w-8 h-8 text-light-secondary dark:text-gray-200 ml-2" />
          <input
            className="ml-2 w-full text-xl outline-none bg-gray-100 dark:bg-gray-900 text-dark-secondary dark:text-gray-100"
            placeholder="Enter code here"
            value={code}
            onChange={(e) => setCode(e.target.value)} // Setează codul
            required
          />
          <Button
            type="submit"
            onClick={(e) => handleJoin(e)} // Apelează funcția handleJoin când se apasă butonul
            className="px-4 py-2 bg-primary rounded-lg text-xl font-semibold ml-2 text-white dark:text-black"
          >
            Join
          </Button>
        </form>
      </div>
      {/* Scrollable Right Section */}
      <div className="flex-1 h-full md:h-screen min-h-screen bg-light-bg dark:bg-dark-bg flex justify-center md:items-start p-2 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
