import type { ValidationError } from 'class-validator';

import type { ValidationIssue } from '../errors/request-validation.error.js';

function joinFieldPath(parent: string, property: string): string {
  if (parent === '') {
    return property;
  }

  if (property === '') {
    return parent;
  }

  return `${parent}.${property}`;
}

function collectIssues(
  error: ValidationError,
  parentPath: string,
  destination: ValidationIssue[],
): void {
  const field = joinFieldPath(parentPath, error.property);

  const constraintMessages =
    error.constraints === undefined ? [] : Object.values(error.constraints);

  if (constraintMessages.length > 0) {
    const messages = [...new Set(constraintMessages)].sort();

    destination.push({
      field: field === '' ? 'request' : field,
      messages,
    });
  }

  const children = [...(error.children ?? [])].sort((left, right) =>
    left.property.localeCompare(right.property),
  );

  for (const child of children) {
    collectIssues(child, field, destination);
  }
}

export function flattenValidationErrors(
  errors: readonly ValidationError[],
): readonly ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const sortedErrors = [...errors].sort((left, right) =>
    left.property.localeCompare(right.property),
  );

  for (const error of sortedErrors) {
    collectIssues(error, '', issues);
  }

  return Object.freeze(
    issues
      .sort((left, right) => left.field.localeCompare(right.field))
      .map((issue) =>
        Object.freeze({
          field: issue.field,
          messages: Object.freeze([...issue.messages]),
        }),
      ),
  );
}
