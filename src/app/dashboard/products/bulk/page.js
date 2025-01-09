// import React, { useState } from 'react';
// import { parse } from 'papaparse';

// const FileUpload = ({ onFileUpload }) => {
//   const [file, setFile] = useState(null);
//   const [error, setError] = useState('');

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       const validExtensions = ['.csv', '.xlsx'];
//       const fileExtension = selectedFile.name.slice(-4);
//       if (!validExtensions.includes(fileExtension)) {
//         setError('Please upload a valid CSV or XLSX file.');
//         return;
//       }
//       setFile(selectedFile);
//       setError('');
//     }
//   };
//   const ProductPreviewGrid = ({ products, onRemove }) => {
//         return (
//           <div>
//             <h2>Product Preview</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>SKU</th>
//                   <th>Images</th>
//                   <th>Name</th>
//                   <th>Description</th>
//                   <th>Price</th>
//                   <th>Discount Price</th>
//                   <th>Discount Percent</th>
//                   <th>Category</th>
//                   <th>Collection Name</th>
//                   <th>Metal</th>
//                   <th>Stock</th>
//                   <th>Slug</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((product, index) => (
//                   <tr key={index}>
//                     <td>{product.sku}</td>
//                     <td>{product.images.join(', ')}</td>
//                     <td>{product.name}</td>
//                     <td>{product.description}</td>
//                     <td>{product.price}</td>
//                     <td>{product.discountPrice}</td>
//                     <td>{product.discountPercent}</td>
//                     <td>{product.category}</td>
//                     <td>{product.collectionName}</td>
//                     <td>{product.metal}</td>
//                     <td>{product.stock}</td>
//                     <td>{product.slug}</td>
//                     <td>
//                       <button onClick={() => onRemove(index)}>Remove</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         );
//       };

//   const handleUpload = () => {
//     if (!file) {
//       setError('Please select a file to upload.');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const text = event.target.result;
//       parse(text, {
//         header: true,
//         complete: (results) => {
//           onFileUpload(results.data);
//         },
//         error: (error) => {
//           setError('Error parsing file: ' + error.message);
//         },
//       });
//     };

//     reader.readAsText(file);
//   };

//   return (
//     <div>
//       <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// };
// const BulkUploadPage = () => {
//         const [products, setProducts] = useState([]);
//         const [errors, setErrors] = useState([]);
      
//         const handleFileUpload = (uploadedProducts) => {
//           const validationErrors = validateProductData(uploadedProducts);
//           if (validationErrors.length > 0) {
//             setErrors(validationErrors);
//           } else {
//             setProducts(uploadedProducts);
//             setErrors([]);
//           }
//         };
      
//         return (
//           <div>
//             <h1>Bulk Product Upload</h1>
//             <FileUpload onUpload={handleFileUpload} />
//             {errors.length > 0 && (
//               <div className="error-messages">
//                 <h2>Errors:</h2>
//                 <ul>
//                   {errors.map((error, index) => (
//                     <li key={index}>{error}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             <ProductPreviewGrid products={products} />
//           </div>
//         );
//       };
      
//       export default BulkUploadPage;