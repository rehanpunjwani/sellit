
export class DateScalar {
  description = 'Date custom scalar type';

  parseValue(value: string): Date {
    return new Date(value); // value from the client
  }

  serialize(value: Date): string {
    return new Date(value).toISOString(); // value sent to the client
  }

  // parseLiteral(ast: any): Date {
  //   if (ast.kind === Kind.INT) {
  //     return new Date(ast.value);
  //   }
  //   return null;
  // }
}