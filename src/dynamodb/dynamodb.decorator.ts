import { Injectable, ScopeOptions } from '@nestjs/common';

export const repositoryClasses: any[] = [];

export const DynamoDBRepository = (options?: ScopeOptions): ClassDecorator => {
  return (target) => {
    repositoryClasses.push(target);

    return Injectable(options)(target);
  };
};
