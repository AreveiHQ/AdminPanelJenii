import * as Yup from 'yup';

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const productSchema = Yup.object().shape({
    sku: Yup.string().required("SKU is required"),
    name: Yup.string().required("Product name is required"),
    price: Yup.number()
        .positive("Price must be positive")
        .required("Price is required"),
    discountPrice: Yup.number()
        .required('Discounted price is required')
        .test('is-less-than-price', 'Discounted price must be less than price', function (value) {
            const { price } = this.parent;
            return value < price;
        }),
    category: Yup.string().required("Category is required"),
    subCategory: Yup.string().required("Sub-Category is required"),
    stock: Yup.number().integer("Stock must be a whole number"),
    description: Yup.string()
        .required("Description is required")
        .min(50, 'Description must have at least 50 characters'),
    images: Yup.mixed()
        .test('fileSize', 'File too large', (value) => {
            if (value?.length) {
                return value.every((file) => file.size <= MAX_FILE_SIZE);
            }
            return true;
        })
        .test('fileFormat', 'Unsupported Format', (value) => {
            if (value?.length) {
                return value.every((file) => SUPPORTED_FORMATS.includes(file.type));
            }
            return true;
        })
        .test("required", "Please upload at least one image", (value) => value && value.length > 0),
        video: Yup.mixed()
        .required('Video file is required'),
    selectedCollections: Yup.array()
        .of(
            Yup.object().shape({
                value: Yup.string().required('Collection is required'),
                label: Yup.string().required('Label is required'),
            })
        ),
    metal: Yup.string(),
    mode: Yup.string(),
});