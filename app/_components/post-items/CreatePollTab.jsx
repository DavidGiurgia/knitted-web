"use client";

import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Alert, Button, Input, Switch, Textarea } from "@heroui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/16/solid";

const CreatePollTab = ({ question, setQuestion, onRemove }) => {
  const [options, setOptions] = useState([""]);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ question, options });
  };

  return (
    <div className=" p-2 space-y-4 border border-gray-100 dark:border-gray-900 rounded-lg">
      <div className="w-full flex items-center justify-between">
        <span className="text-xl ">Multiple choice</span>
        <Button
          radius="full"
          variant="light"
          className=" place-self-end"
          isIconOnly
          onPress={onRemove}
        >
          <XMarkIcon className="size-6 " />
        </Button>
      </div>
      <Textarea
        size="lg"
        maxLength={200}
        type="text"
        variant="bordered"
        label="Question"
        placeholder="What would you like to ask?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        //className="w-full p-2 border resize-none rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              size="lg"
              variant="bordered"
              //type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              //className="w-full p-2 border outline-none rounded-md focus:ring-2 focus:ring-blue-500"
            />

            {options.length > 1 && (
              <TrashIcon
                className="w-6 h-6 hover:text-red-500 cursor-pointer"
                onClick={() => removeOption(index)}
              />
            )}
          </div>
        ))}
      </div>
      {options.length < 10 && (
        <button
          onClick={addOption}
          className="flex items-center space-x-2  text-blue-500 hover:text-blue-700 w-full"
        >
          <PlusCircleIcon className="w-6 h-6" />
          <span>Add Option</span>
        </button>
      )}

      <div className="w-full flex items-center justify-between mt-4 border border-gray-200 dark:border-gray-800 p-4 rounded-xl">
        Allow multiple answers
        <Switch color="success"/>
      </div>
    </div>
  );
};

export default CreatePollTab;
