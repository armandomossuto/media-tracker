import * as React from 'react';
import { EmptyListProps } from './types';

const EmptyList: React.FunctionComponent<EmptyListProps> = ({ type, className = null }: EmptyListProps) =>
  <div className={className}>
    <p>{`Your list of ${type} is currently empty`}</p>
  </div>

export default EmptyList;