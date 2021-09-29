import { Order } from '../../common/order/order';

export enum PostOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  published = 'published',
  title = 'title',
  content = 'content',
}
export class PostOrder extends Order {
  field: PostOrderField;
}
