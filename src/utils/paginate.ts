export function paginate(list: Array<any>, page: number, page_size = 10) {
    // Calculate the start index
    const start_index = (page - 1) * page_size;
    // Use the slice method to obtain the current page data
    const paginated_list = list.slice(start_index, start_index + page_size);
    return paginated_list;
}
