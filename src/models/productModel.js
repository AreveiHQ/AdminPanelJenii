import mongoose from 'mongoose';



const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sku:{
    type:String,
    required:true,
    unique:true
  },
  slug:{
    type:String,
    required:true,
    unique:true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPrice: {
    type: Number,
    required:true,
    min: 0,
  },
  discountPercent:{
    type:Number,
    min:0,
    max:100,
    required:true
  },
  category: {
    name:{
    type: String,
    required: true,
    },
    type:{
      type: String,
    required: true,
    }
  },
  collectionName:[{
    type:String,
  }],
  metal: {
    type: String,
    enum: ['silver', 'gold', 'platinum', 'rose gold'],
    default: 'silver',
  },
  images: [{
    type:String,
    required:true,
  }],
  video: String,
  stock: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isActive:{
    type:Boolean,
    default:true
  }
}, {
  timestamps: true,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
export const OfflineProduct = mongoose.models.OfflineProduct || mongoose.model('OfflineProduct', productSchema);
