'use client';

import React, { useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteUserAccount } from '@/app/services/userService';

const DeleteAccountModal = ({ isOpen, onOpenChange, user }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const router = useRouter();

  const handleDelete = async () => {
    if (user?._id && confirmationText === user?.username) {
      await deleteUserAccount(user?._id);
      toast.success("Your account has been deleted successfully!");
      router.push('/login');
    } else {
      alert('Please type DELETE to confirm.');
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-red-600">
              <span className="text-xl font-bold">Delete Your Account</span>
              <span className="text-sm font-medium text-gray-500">
                This action is irreversible and will permanently delete all your data.
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-yellow-100 text-yellow-700 border border-yellow-400 rounded">
                  <p>
                    <strong>Warning:</strong> Deleting your account will permanently remove:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>Your personal profile and account information.</li>
                    <li>All your posts, messages, and activity data.</li>
                    <li>Your connections and relationships within the platform.</li>
                  </ul>
                  <p className="mt-2">
                    This operation <strong className='text-red-500'>cannot be undone</strong>. Please proceed with caution.
                  </p>
                </div>
                <div>
                  <Input
                    label={`Type '${user?.username}' to confirm`}
                    placeholder={user?.username}
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    color="danger"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                isDisabled={confirmationText !== user?.username}
                onPress={() => {
                  handleDelete();
                  onClose();
                }}
              >
                Delete Account
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteAccountModal;
