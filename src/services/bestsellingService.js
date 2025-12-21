import api from "./api"

export const getBestSellingProducts = async () => {
    try {
        const res = await api.get("/product/bestselling");
        return res.data;
    } catch (error) {
        console.log('error', error)
    }
}