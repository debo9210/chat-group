import React from 'react';

const CreateChannelComponent = ({ createChannelRef }) => {
  return (
    <div className='CreateChannelContainer' ref={createChannelRef}>
      <div className='CreateChannel'>
        <h4>new channel</h4>
        <div className='CreateChannelGroup'>
          <input type='text' placeholder='Channel Name' />
          <textarea placeholder='Channel Description'></textarea>
        </div>
        <div className='CreateChannelBtn'>
          <button>save</button>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelComponent;
