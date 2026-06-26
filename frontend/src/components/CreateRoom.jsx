import React, { useState, useActionState, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserContext } from '../context/UserContext';
import { showError, showSuccess } from '../utils/toast';

const CreateRoom = () => {
  const baseApi = `${import.meta.env.VITE_API_URL}/api/users/room`;
  const { user } = useContext(UserContext);
  const [selectedOption, setSelectedOption] = useState('public');
  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const roomName = formData.get('roomName');
      const roomPassword = formData.get('roomPassword');
      const maxMembers = formData.get('maxMembers');
      const roomTags = formData.get('roomTags').split(',').map(t => t.trim());
      const members = [{ user: user._id, role: 'admin' }];
      const description = formData.get('description');
      const scope = formData.get('roomScope');

      try {
        const res = await fetch(baseApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomName, roomPassword, roomTags, members, description, scope, maxMembers
          }),
          credentials: 'include'
        });
        const result = await res.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to create a room');
        }
        showSuccess(result.message || 'room created successfully');
        return;
      } catch (error) {
        showError(error.message);
        return;
      }
    }, null
  );

  return (
    <div className='p-2 grid grid-cols-3 gap-2 flex-1 overflow-y-scroll custom-scrollbar'>
      <form action={formAction} className='sm:col-span-2 col-span-3 px-2 gap-5 grid-cols-6 grid h-fit w-full'>
        {/* 1. Room Name */}
        <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3'>
          <label htmlFor="roomName" className='font-dosis'>Room Name:</label>
          <input type="text" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary' placeholder='Room name' name='roomName' id='roomName' />
        </div>

        {/* Room Password */}
        <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3'>
          <label htmlFor="roomPassword" className='font-dosis'>Room Password:</label>
          <input type="text" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary' placeholder='Room password' name='roomPassword' id='roomPassword' />
        </div>

        {/* 2. Max Members */}
        <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3'>
          <label htmlFor="maxMembers" className='font-dosis'>Max Members:</label>
          <input type="number" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' placeholder='Joining members' name='maxMembers' id='maxMembers' />
        </div>

        {/* 3. Room Tags */}
        <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3'>
          <label htmlFor="roomTags" className='font-dosis'>Room Tags:</label>
          <input type="text" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary' placeholder='Room tags' name='roomTags' id='roomTags' />
        </div>

        {/* Description */}
        <div className='text-pink items-start flex flex-col gap-3 row-span-2 h-full col-span-6 xs:col-span-3 md:col-span-3'>
          <label htmlFor="roomDesc" className='font-dosis'>Description:</label>
          <textarea
            rows={3}
            className='bg-pink/10 resize-none py-2 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full h-full focus:outline-primary appearance-none'
            placeholder='For study...'
            name='description'
            id='roomDesc'
          />
        </div>

        {/* 4. Room Scope */}
        <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3'>
          <label className='font-dosis'>Room Scope:</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input type="radio" name="roomScope" value="public" checked={selectedOption === 'public'} onChange={(e) => setSelectedOption(e.target.value)} className="hidden" />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === 'public' ? 'border-primary bg-primary' : 'border-pink/40 group-hover:border-primary'}`}>
                <div className={`w-2 h-2 rounded-full bg-white transition-transform ${selectedOption === 'public' ? 'scale-100' : 'scale-0'}`} />
              </div>
              <span className="font-sniglet text-sm text-pink/50">Public Room</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <input type="radio" name="roomScope" value="private" checked={selectedOption === 'private'} onChange={(e) => setSelectedOption(e.target.value)} className="hidden" />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === 'private' ? 'border-primary bg-primary' : 'border-pink/40 group-hover:border-primary'}`}>
                <div className={`w-2 h-2 rounded-full bg-white transition-transform ${selectedOption === 'private' ? 'scale-100' : 'scale-0'}`} />
              </div>
              <span className="font-sniglet text-sm text-pink/50">Private Room</span>
            </label>
          </div>
        </div>

        <div className='col-span-6 flex items-center'>
          <button className='border-white/30 border transition-all py-2 px-3 rounded-xl hover:opacity-80 duration-200 cursor-pointer text-pink bg-primary hover:bg-transparent'>Create</button>
        </div>
      </form>
      <div className='border min-h-100 border-pink/20 rounded-xl col-span-3 sm:col-span-1'></div>
    </div>
  );
};

export default CreateRoom;