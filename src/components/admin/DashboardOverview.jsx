'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Utensils, TrendingUp, Calendar, Clock } from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalStaff: 0,
    todayMeals: 0,
    pendingRegistrations: 0
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [membersRes, staffRes, mealsRes] = await Promise.all([
        fetch('/api/admin/members?limit=5'),
        fetch('/api/admin/staff?limit=5'),
        fetch('/api/admin/meals')
      ]);

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setStats(prev => ({ ...prev, totalMembers: membersData.pagination.total }));
        setRecentMembers(membersData.members);
      }

      if (staffRes.ok) {
        const staffData = await staffRes.json();
        setStats(prev => ({ ...prev, totalStaff: staffData.pagination.total }));
      }

      if (mealsRes.ok) {
        const mealsData = await mealsRes.json();
        const todayTotal = Object.values(mealsData.mealSummary).reduce((sum, meal) => sum + meal.consumed, 0);
        setStats(prev => ({ ...prev, todayMeals: todayTotal }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12% from last week'
    },
    {
      title: 'Total Staff',
      value: stats.totalStaff,
      icon: UserPlus,
      color: 'bg-green-500',
      change: '+3 this month'
    },
    {
      title: 'Today\'s Meals',
      value: stats.todayMeals,
      icon: Utensils,
      color: 'bg-orange-500',
      change: 'Active tracking'
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingRegistrations,
      icon: Clock,
      color: 'bg-yellow-500',
      change: 'Requires attention'
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to the WET-WAR 2025 Conference Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <UserPlus className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Add New Member</p>
                  <p className="text-sm text-gray-600">Register conference attendee</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Add Staff Member</p>
                  <p className="text-sm text-gray-600">Manage conference staff</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Utensils className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Update Meal Count</p>
                  <p className="text-sm text-gray-600">Track restaurant deliveries</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
          <div className="space-y-3">
            {recentMembers.slice(0, 5).map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.institute}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-gray-500">{member.registration_number}</p>
                  <p className="text-xs text-gray-400">{new Date(member.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {recentMembers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent registrations</p>
            )}
          </div>
        </div>
      </div>

      {/* Conference Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">WET-WAR 2025 Conference</h3>
            <p className="text-blue-100 mb-4">
              International Conference on Water, Environment, Technology & Waste Management
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Conference Dates: TBD</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Registration: Open</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.totalMembers}</div>
            <div className="text-blue-200">Total Attendees</div>
          </div>
        </div>
      </div>
    </div>
  );
}
