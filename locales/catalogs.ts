const getCatalog = async (locale: string) => import(`./${locale}/messages`);
export default getCatalog;
