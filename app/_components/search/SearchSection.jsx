"use client";
import { useAuth } from "@/app/_context/AuthContext";
import React, { useEffect, useState } from "react";
import UserListItem from "../UserListItem";
import { getRecentSearches } from "@/app/services/recentSearchesService";
import {
  addRecentSearch,
  clearRecentSearch,
  removeRecentSearch,
} from "@/app/api/recent-searches";
import { searchUser } from "@/app/api/user";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

const SearchSection = ({ pushSubPanel }) => {
  const { user } = useAuth();
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    // Obține recenții la montarea componentei
    const getRecentUsers = async () => {
      const recentUsers = await getRecentSearches(user?._id);
      setRecent(recentUsers);
    };

    getRecentUsers();
  }, [user?._id]);

  const handleAddToRecent = async (currUser) => {
    setRecent((prev) => {
      const isAlreadyInRecent = prev.some((u) => u._id === currUser._id);
      if (isAlreadyInRecent) return prev;
      return [currUser, ...prev].slice(0, 10); // Păstrează maxim 10 recenți
    });

    // Salvează în backend
    await addRecentSearch(user._id, currUser._id);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (value.trim() === "") {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const result = await searchUser(value, user._id);
        setResults(result);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300); // Debounce pentru a evita apeluri frecvente

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  const handleClearRecent = async () => {
    setRecent([]);
    try {
      await clearRecentSearch(user._id);
    } catch (error) {
      console.error("Error clearing recent searches: " + error.message);
    }
  };

  const handleRemoveSearch = async (item) => {
    try {
      await removeRecentSearch(user._id, item._id);
      setRecent(recent.filter((u) => u._id !== item._id));
    } catch (error) {
      console.error("Error removing recent search: " + error.message);
    }
  };

  return (
    <div className="w-full h-full flex-1 p-6 flex flex-col gap-y-4 ">
      <div className="flex items-center p-2 border border-gray-200 dark:border-gray-800 rounded-lg">
        <MagnifyingGlassIcon className="text-gray-500 size-4 mr-2" />
        <input
          autoFocus
          onChange={(event) => setValue(event.currentTarget.value)}
          value={value}
          placeholder="Search"
          className="flex-1 outline-none bg-transparent"
        />
      </div>

      <div className="flex-1 h-full ">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : value ? (
          results?.length > 0 ? (
            <ul className="flex flex-col gap-y-2">
              {results.map((currUser) => (
                <li
                  className="flex items-center py-1 px-2 justify-between rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  key={currUser._id}
                  onClick={() => {
                    handleAddToRecent(currUser);
                    {
                      pushSubPanel("Profile", currUser);
                    }
                  }} // Adaugă la recents
                >
                  <UserListItem user={currUser} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500">No results found</div>
          )
        ) : (
          <div className="h-full flex flex-col ">
            <div className="flex justify-between items-center px-2">
              <div className="">Recent</div>
              <button
                onClick={handleClearRecent}
                className={`text-sm text-blue-500 hover:underline ${
                  recent.length === 0 && "hidden"
                }`}
              >
                Clear all
              </button>
            </div>
            {recent.length > 0 ? (
              <div className="flex flex-col flex-1 h-full ">
                <ul className="mt-2">
                  {recent.map((currUser) => (
                    <li
                      className="flex items-center  px-2 py-1 justify-between rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      key={currUser._id}
                      onClick={() => pushSubPanel("Profile", currUser)}
                    >
                      <UserListItem user={currUser} />
                      <Button
                        size="sm"
                        onPress={() => handleRemoveSearch(currUser)}
                        variant="light"
                        isIconOnly
                      >
                        <XMarkIcon className="size-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex-1 flex h-full  justify-center items-center text-gray-500">
                No recent searches
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSection;
