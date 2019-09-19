import * as React from 'react';

const CustomMessage: React.FunctionComponent<MessageProps> = ({ message }: MessageProps) =>
  <div className="no-results">
    <p> {message} </p>
  </div>

type MessageProps = {
  message: string;
}

export default CustomMessage;