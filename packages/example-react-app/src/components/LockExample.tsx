// Example of using the useLock hook
import React from 'react';
import { useLock } from '@express-cc/react-client';

function LockExample() {
  const { lock, lockLost } = useLock('document', 'XdfZ32243wK', {
    baseUrl: 'http://localhost:3000/cc',
    duration: 180,
    retryInterval: 10,
  });

  if (lockLost) {
    return <div className='error'>Lock lost! Another user may have taken control of this resource.</div>;
  }

  if (!lock) {
    return <div className='loading'>Acquiring lock...</div>;
  }

  return (
    <div className='lock-info'>
      <h3>Resource Lock Active</h3>
      <p>You have exclusive access to edit this resource.</p>

      {/* Example of what might be in your editing interface */}
      <textarea className='resource-editor' defaultValue={`Editing resource XdfZ32243wK...`} />

      <div className='lock-details' style={{ fontFamily: 'arial' }}>
        <strong>Lock Details:</strong>
        <br />
        <span>ResourceType: {lock.resourceType}</span>
        <br />
        <span>ResourceId: {lock.resourceId}</span>
        <br />
        <span>Duration: {lock.duration} seconds</span> <br />
        <span>Acquired: {lock.acquiredAt}</span> <br />
        <span>Expires: {lock.expiresAt}</span> <br />
        <span>Owner: {lock.ownerId}</span>
      </div>
    </div>
  );
}

export default LockExample;
