import React, { useState, useEffect } from 'react';

interface Match {
  id: number;
  userA: {
    id: number;
    name: string;
    userCode: string;
    age: number;
    religion: string;
    location: string;
  };
  userB: {
    id: number;
    name: string;
    userCode: string;
    age: number;
    religion: string;
    location: string;
  };
  matchDate: string;
  matchScore: number;
  status: 'active' | 'viewed' | 'contacted';
}

const MatchesManagement: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        setTimeout(() => {
          setMatches([
            {
              id: 1,
              userA: {
                id: 1,
                name: 'Sundararajan',
                userCode: 'NN#00001',
                age: 30,
                religion: 'Hindu',
                location: 'Hyderabad',
              },
              userB: {
                id: 2,
                name: 'Kalaivani',
                userCode: 'NN#00002',
                age: 28,
                religion: 'Hindu',
                location: 'Chennai',
              },
              matchDate: '2024-09-23',
              matchScore: 95,
              status: 'active',
            },
            {
              id: 2,
              userA: {
                id: 3,
                name: 'Rajesh Kumar',
                userCode: 'NN#00003',
                age: 32,
                religion: 'Hindu',
                location: 'Bangalore',
              },
              userB: {
                id: 4,
                name: 'Priya Sharma',
                userCode: 'NN#00004',
                age: 26,
                religion: 'Hindu',
                location: 'Mumbai',
              },
              matchDate: '2024-09-22',
              matchScore: 88,
              status: 'viewed',
            },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const filteredMatches = matches.filter(m => {
    const matchesSearch =
      m.userA.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.userB.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.userA.userCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.userB.userCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMatches = filteredMatches.slice(startIndex, endIndex);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">Loading matches...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Matches Management</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 py-2 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]">
            <span>📥</span> Export
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by user name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="viewed">Viewed</option>
          <option value="contacted">Contacted</option>
        </select>
      </div>

      <div className="flex gap-6">
        <div className={`flex-1 ${selectedMatch ? 'lg:w-2/3' : 'w-full'}`}>
          {paginatedMatches.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <p className="text-gray-500 text-lg">No matches found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedMatches.map((match) => (
                <div
                  key={match.id}
                  className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all duration-200 ${
                    selectedMatch?.id === match.id
                      ? 'border-[#14b8a6] shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      Match Score: {match.matchScore}%
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        match.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : match.status === 'viewed'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white font-bold text-lg">
                        {match.userA.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-1">{match.userA.name}</div>
                        <div className="text-sm text-gray-600">
                          {match.userA.userCode} • {match.userA.age} • {match.userA.religion} • {match.userA.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl text-gray-400">↔</div>
                    <div className="flex-1 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {match.userB.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-1">{match.userB.name}</div>
                        <div className="text-sm text-gray-600">
                          {match.userB.userCode} • {match.userB.age} • {match.userB.religion} • {match.userB.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
                    Matched on: {match.matchDate}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredMatches.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredMatches.length)} of {filteredMatches.length} matches
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm text-gray-800 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 border rounded-lg text-sm flex items-center justify-center transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-[#14b8a6] text-white border-[#14b8a6]'
                              : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} className="px-2 text-gray-500 text-sm">...</span>;
                    }
                    return null;
                  })}
                </div>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm text-gray-800 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedMatch && (
          <div className="hidden lg:block w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-fit sticky top-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Match Details</h2>
              <button
                onClick={() => setSelectedMatch(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                ×
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">User A</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-gray-700">Name:</strong> <span className="text-gray-600">{selectedMatch.userA.name}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Code:</strong> <span className="text-gray-600">{selectedMatch.userA.userCode}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Age:</strong> <span className="text-gray-600">{selectedMatch.userA.age} years</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Religion:</strong> <span className="text-gray-600">{selectedMatch.userA.religion}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Location:</strong> <span className="text-gray-600">{selectedMatch.userA.location}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">User B</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-gray-700">Name:</strong> <span className="text-gray-600">{selectedMatch.userB.name}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Code:</strong> <span className="text-gray-600">{selectedMatch.userB.userCode}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Age:</strong> <span className="text-gray-600">{selectedMatch.userB.age} years</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Religion:</strong> <span className="text-gray-600">{selectedMatch.userB.religion}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Location:</strong> <span className="text-gray-600">{selectedMatch.userB.location}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Match Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-gray-700">Match Score:</strong> <span className="text-gray-600">{selectedMatch.matchScore}%</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Match Date:</strong> <span className="text-gray-600">{selectedMatch.matchDate}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Status:</strong>{' '}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedMatch.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : selectedMatch.status === 'viewed'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {selectedMatch.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesManagement;
