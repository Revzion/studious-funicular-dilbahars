// components/Sections/AddressesSection.jsx
import { MapPin, Home, Building, Plus, Edit, Trash2 } from 'lucide-react';

const AddressesSection = ({ addresses, onAddAddress, onEditAddress, onDeleteAddress }) => {
  const getAddressIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'home':
        return <Home size={20} />;
      case 'office':
        return <Building size={20} />;
      default:
        return <MapPin size={20} />;
    }
  };

  const getAddressTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'home':
        return 'bg-green-600';
      case 'office':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Manage Addresses</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`bg-white p-6 rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
              address.isDefault ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${getAddressTypeColor(address.type)}`}>
                  {getAddressIcon(address.type)}
                  <span className="ml-1">{address.type.toUpperCase()}</span>
                </span>
                {address.isDefault && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    Default
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-gray-700 mb-4 space-y-1">
              <p className="font-semibold">{address.name}</p>
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.pincode}</p>
              <p>{address.country}</p>
              <p className="text-sm">Phone: {address.phone}</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => onEditAddress(address.id)}
                className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors text-sm"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
              <button
                onClick={() => onDeleteAddress(address.id)}
                className="flex items-center px-3 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors text-sm"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {/* Add New Address Card */}
        <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[200px] hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
          <button
            onClick={onAddAddress}
            className="flex flex-col items-center space-y-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus size={24} className="text-blue-600" />
            </div>
            <span className="font-medium">Add New Address</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressesSection;