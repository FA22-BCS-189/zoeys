-- DropIndex
DROP INDEX "Collection_order_idx";

-- DropIndex
DROP INDEX "Collection_slug_idx";

-- DropIndex
DROP INDEX "Order_customerPhone_idx";

-- DropIndex
DROP INDEX "Order_orderNumber_idx";

-- DropIndex
DROP INDEX "Product_price_idx";

-- DropIndex
DROP INDEX "Product_slug_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stockStatus" TEXT NOT NULL DEFAULT 'in_stock',
ALTER COLUMN "pieces" SET DEFAULT '3 pc';

-- CreateIndex
CREATE INDEX "Product_quantity_idx" ON "Product"("quantity");

-- CreateIndex
CREATE INDEX "Product_stockStatus_idx" ON "Product"("stockStatus");
