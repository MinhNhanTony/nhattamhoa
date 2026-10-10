const {
    mongooseToObject,
    mutipleMongooseToObject,
} = require('../../util/mongoose');

const { getProduct } = require('../../util/getDataFromDB');
const ProductModel = require('../../app/models/Product');
const { makeNumberSorter } = require('../../util/makeNumberSorter');

class ProductsController {
    // [GET] /products/:slug
    async productDetail(req, res) {
        try {
            const slug = req.params.slug;

            // Tìm thông tin sản phẩm hiện tại
            const productInfor = await ProductModel.findOne({
                slug: slug
            });

            // Không tìm thấy sản phẩm
            if (!productInfor) {
                return res.status(404).send('Không tìm thấy sản phẩm.');
            }

            // Chuyển dữ liệu Mongoose sang object thông thường
            const productObject = mongooseToObject(productInfor);

            // Ảnh đại diện sản phẩm
            const productAvatar = productObject?.productImg?.[0];

            // Hotline
            const hotline = process.env.ADMIN_PHONE;

            // Số lượng sản phẩm liên quan tối đa muốn hiển thị
            const MAX_RELATED_PRODUCTS = 12;

            // Lấy các sản phẩm đang kinh doanh,
            // loại trừ sản phẩm hiện tại
            const relatedProducts = await ProductModel.find({
                isAvailable: true,
                _id: { $ne: productInfor._id }
            });

            // Trộn ngẫu nhiên danh sách sản phẩm
            const shuffledProducts = [...relatedProducts];

            for (let i = shuffledProducts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                [
                    shuffledProducts[i],
                    shuffledProducts[j]
                ] = [
                    shuffledProducts[j],
                    shuffledProducts[i]
                ];
            }

            // Chỉ lấy tối đa số lượng sản phẩm mong muốn.
            // Nếu database không đủ, chỉ hiển thị số lượng hiện có.
            const newrelatedProducts = shuffledProducts.slice(
                0,
                MAX_RELATED_PRODUCTS
            );

            // Sắp xếp theo hàm hiện có của dự án
            const sortedRelatedProducts = await makeNumberSorter(
                newrelatedProducts
            );

            // Render trang chi tiết sản phẩm
            return res.render('products/detailProduct', {
                productInfor: productObject,

                pageTitle: `${productObject.productName} - ${process.env.DOMAINNAME}`,

                productAvatar,

                hotline,

                products: mutipleMongooseToObject(
                    sortedRelatedProducts
                )
            });

        } catch (error) {
            console.error('Lỗi productDetail:', error);

            return res.status(500).send(
                'Đã xảy ra lỗi khi tải thông tin sản phẩm.'
            );
        }
    }


    // [GET] /product/id
    async productInfor(req, res) {
      const id = req.params.id;
      const productInfor = await ProductModel.findOne({_id:id});
      res.json(productInfor);
    }
  }
  
  module.exports = new ProductsController();
  