export interface IRepository<T> {
	insert(model: T): T;
}
