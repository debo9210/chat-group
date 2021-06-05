import React from 'react';

const CreateChannelComponent = ({
  createChannelRef,
  createChannel,
  createChannelErr,
  inputValueHandler,
  textAreaValueHandler,
  createChannelInputRef,
  createChannelTextAreaRef,
}) => {
  return (
    <div className='CreateChannelContainer' ref={createChannelRef}>
      <div className='CreateChannel'>
        <h4>new channel</h4>
        <div className='CreateChannelGroup'>
          <div>
            <input
              type='text'
              placeholder='Channel Name'
              onChange={inputValueHandler}
              style={
                createChannelErr.channelName ? { marginBottom: '5px' } : null
              }
              ref={createChannelInputRef}
            />
            <small
              className='ErrorMsg'
              style={
                createChannelErr
                  ? { display: 'inline-block', marginBottom: '10px' }
                  : null
              }
            >
              {createChannelErr ? createChannelErr.channelName : null}
            </small>
          </div>
          <div>
            <textarea
              placeholder='Channel Description'
              style={
                createChannelErr.channelDesc ? { marginBottom: '5px' } : null
              }
              onChange={textAreaValueHandler}
              ref={createChannelTextAreaRef}
            ></textarea>
            <small
              className='ErrorMsg'
              style={
                createChannelErr
                  ? { display: 'inline-block', marginBottom: '10px' }
                  : null
              }
            >
              {createChannelErr ? createChannelErr.channelDesc : null}
            </small>
          </div>
        </div>
        <div className='CreateChannelBtn'>
          <button onClick={createChannel}>save</button>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelComponent;
