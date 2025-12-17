import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Phone, Mail, MapPin, Package } from 'lucide-react';
import { adminAPI } from '../utils/adminAuth';
import { formatPrice, getPlaceholderImage } from '../../utils/helpers';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const response = await adminAPI.getOrders(params);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        const response = await adminAPI.getOrder(orderId);
        setSelectedOrder(response.data);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await adminAPI.getOrder(orderId);
      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerPhone?.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'confirmed': return 'bg-emerald-100 text-emerald-800';
      case 'delivered': return 'bg-emerald-200 text-emerald-900';
      case 'cancelled': return 'bg-rose-100 text-rose-800';
      default: return 'bg-amber-50 text-charcoal/80';
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-amber-100 rounded w-1/4"></div>
          <div className="h-64 bg-amber-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-charcoal">Orders</h1>
        <p className="text-charcoal/80 mt-1 lg:mt-2">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 p-3 lg:p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
          <div className="relative">
            <Search className="absolute left-2 lg:left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 lg:pl-10 pr-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 lg:px-4 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] lg:min-w-full w-full">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Order #</th>
                <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Customer</th>
                <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Contact</th>
                <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Items</th>
                <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Total</th>
                <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Status</th>
                <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Date</th>
                <th className="px-3 lg:px-4 py-2 lg:py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-200/30">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-amber-50 transition-colors">
                  <td className="px-3 lg:px-4 py-2 lg:py-3 whitespace-nowrap text-sm font-medium text-charcoal">#{order.orderNumber}</td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 text-sm">
                    <div className="font-medium text-charcoal">{order.customerName}</div>
                    <div className="text-charcoal/60 text-xs">{order.city}</div>
                  </td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 text-sm">
                    <div className="text-charcoal">{order.customerPhone}</div>
                    {order.customerEmail && <div className="text-charcoal/60 text-xs">{order.customerEmail}</div>}
                  </td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 whitespace-nowrap text-sm text-charcoal">{order.items?.length || 0} items</td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 whitespace-nowrap text-sm font-medium text-emerald-700">{formatPrice(order.totalAmount)}</td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-emerald-500 ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 whitespace-nowrap text-sm text-charcoal/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 lg:px-4 py-2 lg:py-3 whitespace-nowrap">
                    <button
                      onClick={() => viewOrderDetails(order.id)}
                      className="p-1 lg:p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-6 lg:p-8 text-center">
            <Package size={48} className="mx-auto mb-4 text-emerald-300" />
            <p className="text-charcoal/80">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 lg:p-6 border-b border-emerald-200/30">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <h2 className="text-xl lg:text-2xl font-display font-bold text-charcoal">Order #{selectedOrder.orderNumber}</h2>
                  <p className="text-charcoal/80 text-sm">Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className={`px-3 py-2 text-sm font-semibold rounded-full border-0 focus:ring-2 focus:ring-emerald-500 ${getStatusColor(selectedOrder.status)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="p-4 lg:p-6 space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-amber-50 rounded-lg p-4">
                  <h3 className="font-display font-bold text-charcoal mb-3 flex items-center gap-2">
                    <Phone size={18} />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                    <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                    {selectedOrder.customerEmail && <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <h3 className="font-display font-bold text-charcoal mb-3 flex items-center gap-2">
                    <MapPin size={18} />
                    Delivery Address
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>{selectedOrder.deliveryAddress}</p>
                    <p><strong>City:</strong> {selectedOrder.city}</p>
                    {selectedOrder.notes && (
                      <div className="mt-2">
                        <p><strong>Notes:</strong> {selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

{/* Order Items */}
<div>
  <h3 className="font-display font-bold text-charcoal mb-4">Order Items</h3>
  <div className="space-y-3">
    {selectedOrder.items?.length > 0 ? (
      selectedOrder.items.map((item, index) => {
        // Access the product data from item.product
        const product = item.product || {};
        const productName = product.name || 'Unknown Product';
        const productColor = product.color || 'N/A';
        const productPieces = product.pieces || 'N/A';
        const productImages = product.images || [];
        
        // Price and quantity come from the order item itself
        const itemPrice = item.price || 0;
        const itemQuantity = item.quantity || 0;

        return (
          <div key={index} className="flex items-center gap-3 bg-amber-50 rounded-lg p-3">
            <img
              src={productImages[0] || getPlaceholderImage(productColor)}
              alt={productName}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-charcoal text-sm">{productName}</h4>
              <p className="text-charcoal/60 text-xs">{productColor} • {productPieces}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-emerald-700 text-sm">{formatPrice(itemPrice)}</p>
              <p className="text-charcoal/60 text-xs">Qty: {itemQuantity}</p>
            </div>
          </div>
        );
      })
    ) : (
      <div className="text-center py-4 text-charcoal/60">
        No items found in this order
      </div>
    )}
  </div>
</div>

              {/* Order Summary */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="font-display font-bold text-charcoal mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                  <div className="border-t border-emerald-200/30 pt-2 flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-emerald-700">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 lg:p-6 border-t border-emerald-200/30">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;