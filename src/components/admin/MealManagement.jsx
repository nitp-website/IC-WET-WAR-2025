'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Utensils, Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationDialog from './ui/ConfirmationDialog';

export default function MealManagement() {
  const [meals, setMeals] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    mealType: 'breakfast',
    quantityDelivered: 0,
    notes: ''
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState(null);

  useEffect(() => {
    fetchMeals();
  }, [selectedDate]);

  const fetchMeals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/meals?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setMeals(data);
      } else {
        toast.error('Failed to fetch meals');
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
      toast.error('Error fetching meals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          mealDate: selectedDate
        })
      });

      if (response.ok) {
        toast.success('Meal record updated successfully!');
        setShowAddForm(false);
        setFormData({
          mealType: 'breakfast',
          quantityDelivered: 0,
          notes: ''
        });
        fetchMeals();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update meal record');
      }
    } catch (error) {
      toast.error('Error updating meal record');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMealConsumption = async (memberId, mealType, isConsumed) => {
    try {
      const response = await fetch('/api/admin/meals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          memberId,
          mealType,
          mealDate: selectedDate,
          isConsumed
        })
      });

      if (response.ok) {
        fetchMeals();
        toast.success(`Meal consumption updated for ${mealType}`);
      } else {
        toast.error('Failed to update meal consumption');
      }
    } catch (error) {
      toast.error('Error updating meal consumption');
    }
  };

  const handleDelete = (mealType) => {
    setDeleteAction(() => () => {
      // Replace with actual delete logic
      console.log(`Deleting ${mealType}`);
      toast.success(`${mealType} deleted successfully`);
      setIsDeleteDialogOpen(false);
    });
    setIsDeleteDialogOpen(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'lunch', label: 'Lunch', color: 'bg-green-100 text-green-800' },
    { id: 'dinner', label: 'Dinner', color: 'bg-blue-100 text-blue-800' },
    { id: 'snack', label: 'Snack', color: 'bg-purple-100 text-purple-800' }
  ];

  const getMealSummary = (mealType) => {
    return meals.mealSummary?.[mealType] || { consumed: 0, delivered: 0, remaining: 0, attendees: [] };
  };

  return (
    <div className="p-6">
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={deleteAction}
        title="Confirm Deletion"
        message="Are you sure you want to delete this meal record? This action cannot be undone."
      />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meal Management</h2>
          <p className="text-gray-600">Track restaurant deliveries and attendee meal consumption</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Update Meal Count
        </button>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800"
          />
          <span className="text-sm text-gray-800">
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Meal Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mealTypes.map((mealType) => {
          const summary = getMealSummary(mealType.id);
          return (
            <div key={mealType.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{mealType.label}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${mealType.color}`}>
                  {mealType.id}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delivered:</span>
                  <span className="font-semibold text-gray-900">{summary.delivered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Consumed:</span>
                  <span className="font-semibold text-green-600">{summary.consumed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining:</span>
                  <span className={`font-semibold ${summary.remaining >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {summary.remaining >= 0 ? summary.remaining : 'Overbooked'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Update Meal Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Meal Count</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meal Type
                  </label>
                  <select
                    name="mealType"
                    value={formData.mealType}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    {mealTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity Delivered
                  </label>
                  <input
                    type="number"
                    name="quantityDelivered"
                    required
                    min="0"
                    value={formData.quantityDelivered}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    placeholder="Optional notes about the delivery"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Updating...' : 'Update Count'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Meal Details by Type */}
      <div className="space-y-6">
        {mealTypes.map((mealType) => {
          const summary = getMealSummary(mealType.id);
          return (
            <div key={mealType.id} className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Utensils className="h-5 w-5 mr-2 text-orange-600" />
                  {mealType.label} - {selectedDate}
                </h3>
                <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {summary.consumed} consumed
                  </span>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {summary.delivered} delivered
                  </span>
                  <span className={`flex items-center ${summary.remaining >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {summary.remaining >= 0 ? `${summary.remaining} remaining` : `${Math.abs(summary.remaining)} overbooked`}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4">
                {summary.attendees.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 mb-3">Attendees</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {summary.attendees.map((attendee) => (
                        <div key={attendee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{attendee.name}</p>
                            <p className="text-xs text-gray-500">{attendee.registration_number}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleMealConsumption(attendee.member_id, mealType.id, !attendee.is_consumed)}
                              className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${attendee.is_consumed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {attendee.is_consumed ? <><CheckCircle className="h-4 w-4 mr-1" />Consumed</> : <><XCircle className="h-4 w-4 mr-1" />Not Consumed</>}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No attendees registered for this meal</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
