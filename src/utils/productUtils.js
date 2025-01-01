export default function calculatedDiscount(price, discountedPrice) {
        const discount = ((price - discountedPrice) / price) * 100;
        return Math.ceil(discount);
}

