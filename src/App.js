import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Lucide React Icons
import {
  User, Lock, Wallet, ReceiptText, Printer, X, Plus, DollarSign, BookOpen, Star, Sun, Moon, Sparkles,
  HeartHandshake, Home, ShieldCheck, Banknote, CalendarDays, BarChart4, LogOut, Package, Users, Settings, ClipboardList, TrendingUp, CalendarCheck, Handshake, BellRing,
  Award, ScrollText, PiggyBank, Briefcase, Feather, Landmark, GraduationCap, Gift, ClipboardCopy, CircleDollarSign,
  HandCoins, BookUser, FileText, Globe, Gem, Leaf, Lightbulb, Zap, Cloud, Anchor, Compass, Dribbble, Figma, GitBranch,
  Hammer, Hourglass, Key, LifeBuoy, MessageSquare, Monitor, PieChart, Puzzle, Radio, Rocket, Scissors, Target, Umbrella,
  Vespa, Wheat, Wine, ZapOff, ZoomIn, TrendingDown,
} from 'lucide-react';

// --- Component Imports ---
// AuthModal component for handling user login
const AuthModal = ({ handleLogin, loading, message, ALL_USERS }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4">
      <div className="bg-gradient-to-br from-purple-800 to-indigo-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-purple-700 backdrop-filter backdrop-blur-md" data-aos="zoom-in">
        <h2 className="text-3xl font-bold text-center text-yellow-300 mb-6 flex items-center justify-center gap-2">
          <Sun className="w-8 h-8" /> Login
        </h2>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-200 text-sm font-semibold mb-2" htmlFor="username">
              <User className="inline-block w-4 h-4 mr-2" /> Username
            </label>
            <input
              type="email"
              id="username"
              className="w-full p-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300"
              placeholder="e.g., devotee@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-200 text-sm font-semibold mb-2" htmlFor="password">
              <Lock className="inline-block w-4 h-4 mr-2" /> Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-purple-900 font-bold py-3 px-4 rounded-lg shadow-lg hover:from-yellow-400 hover:to-orange-400 transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-purple-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" /> Login
              </>
            )}
          </button>
          {message && (
            <p className={`text-center text-sm mt-4 ${message.includes('successful') ? 'text-green-300' : 'text-red-300'}`}>
              {message}
            </p>
          )}
          <div className="text-center text-sm text-gray-300 mt-4">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            {ALL_USERS.map(user => (
              <p key={user.id} className="mb-1">
                <span className="font-bold capitalize">{user.role}:</span> {user.username} / {user.password}
              </p>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

// DevoteeDashboard component
const DevoteeDashboard = ({ currentUser, transactions, setTransactions, saveAllTransactions, GENERAL_DONATION_CATEGORIES, SPECIFIC_DONATION_PURPOSES, GURU_DEVS, setMessage, ashramEvents }) => {
  const [amount, setAmount] = useState('');
  const [selectedGeneralCategory, setSelectedGeneralCategory] = useState(GENERAL_DONATION_CATEGORIES[0].id);
  const [selectedGuruDevId, setSelectedGuruDevId] = useState('');
  const [selectedSpecificPurpose, setSelectedSpecificPurpose] = useState(SPECIFIC_DONATION_PURPOSES[0].id);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const receiptRef = useRef();

  useEffect(() => {
    // Set initial Guru Dev if Guru Seva is selected by default
    if (selectedGeneralCategory === 'guru-seva' && GURU_DEVS.length > 0) {
      setSelectedGuruDevId(GURU_DEVS[0].id);
    } else {
      setSelectedGuruDevId(''); // Clear if not Guru Seva
    }
  }, [selectedGeneralCategory, GURU_DEVS]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setMessage('Please enter a valid positive amount.');
      setLoading(false);
      return;
    }

    if (!currentUser) {
      setMessage('User not logged in. Please log in to make a deposit.');
      setLoading(false);
      return;
    }

    if (selectedGeneralCategory === 'guru-seva' && !selectedGuruDevId) {
      setMessage('Please select a Guru Dev for Guru Seva donation.');
      setLoading(false);
      return;
    }

    try {
      const newTransaction = {
        id: 'TRN' + Date.now() + Math.random().toString(36).substr(2, 9),
        amount: depositAmount,
        generalCategory: selectedGeneralCategory,
        specificPurpose: selectedSpecificPurpose,
        guruDevId: selectedGeneralCategory === 'guru-seva' ? selectedGuruDevId : null,
        timestamp: new Date().toISOString(),
        devoteeId: currentUser.id,
        devoteeName: currentUser.name,
      };

      const currentAllTransactions = JSON.parse(localStorage.getItem('ashram_all_transactions') || '[]');
      const updatedAllTransactions = [...currentAllTransactions, newTransaction];
      saveAllTransactions(updatedAllTransactions);

      const devoteeTransactions = updatedAllTransactions.filter(txn => txn.devoteeId === currentUser.id);
      devoteeTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setTransactions(devoteeTransactions);

      const generalCategoryName = GENERAL_DONATION_CATEGORIES.find(c => c.id === selectedGeneralCategory)?.name || selectedGeneralCategory;
      const specificPurposeName = SPECIFIC_DONATION_PURPOSES.find(p => p.id === selectedSpecificPurpose)?.name || selectedSpecificPurpose;
      const guruDevName = selectedGeneralCategory === 'guru-seva' ? (GURU_DEVS.find(g => g.id === selectedGuruDevId)?.name || 'N/A') : 'N/A';

      const receipt = {
        transactionId: newTransaction.id,
        date: new Date().toLocaleString(),
        devoteeName: currentUser.name,
        amount: depositAmount.toFixed(2),
        generalCategory: generalCategoryName,
        specificPurpose: specificPurposeName,
        guruDevName: guruDevName,
        message: 'Thank you for your generous contribution!',
      };
      setReceiptData(receipt);
      setShowReceipt(true);
      setShowDepositModal(false);
      setAmount('');
      setMessage('Deposit successful! Receipt generated.');
    } catch (error) {
      console.error('Error depositing money:', error);
      setMessage('Failed to process deposit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write('<html><head><title>Donation Receipt</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        body { font-family: 'Inter', sans-serif; margin: 20px; color: #333; }
        .receipt-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #eee;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          background-color: #fff;
          border-radius: 8px;
        }
        h2 { color: #5a2d82; text-align: center; margin-bottom: 20px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .detail-row span:first-child { font-weight: bold; }
        .thank-you { text-align: center; margin-top: 30px; font-style: italic; color: #666; }
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      `);
      printWindow.document.write('</style></head><body>');
      printWindow.document.write(receiptRef.current.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getTotalDeposits = () => {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0).toFixed(2);
  };

  const getSpecificPurposeIcon = (purposeId) => {
    const purpose = SPECIFIC_DONATION_PURPOSES.find(p => p.id === purposeId);
    return purpose ? purpose.icon : <Sparkles className="w-5 h-5 text-gray-400" />;
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white border-opacity-20" data-aos="fade-up">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-white border-opacity-20">
          <h1 className="text-4xl font-extrabold text-yellow-300 mb-4 sm:mb-0 flex items-center gap-3" data-aos="fade-right">
            <Moon className="w-10 h-10" /> Devotee Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4" data-aos="fade-left">
            <div className="text-lg font-semibold text-gray-200">
              Welcome, <span className="text-yellow-300">{currentUser?.name || 'Devotee'}</span>!
            </div>
          </div>
        </div>

        {/* Ashram Events / Notifications */}
        {ashramEvents.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg shadow-md mb-8 text-white" data-aos="fade-down">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <BellRing className="w-6 h-6 animate-pulse" /> Upcoming Ashram Events
            </h3>
            <ul className="list-disc pl-5">
              {ashramEvents.slice(0, 3).map((event, index) => ( // Show top 3 events
                <li key={event.id} className="mb-1 text-sm">
                  <span className="font-semibold">{event.name}</span> on {event.date} - {event.description}
                </li>
              ))}
              {ashramEvents.length > 3 && (
                <li className="text-sm italic">And more...</li>
              )}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-700 to-purple-700 p-6 rounded-xl shadow-xl flex items-center justify-between" data-aos="fade-up" data-aos-delay="200">
            <div>
              <p className="text-gray-200 text-sm font-medium">Your Devotee ID</p>
              <p className="text-yellow-300 text-xl font-bold break-all">{currentUser?.id || 'N/A'}</p>
            </div>
            <User className="w-10 h-10 text-indigo-300 opacity-70" />
          </div>
          <div className="bg-gradient-to-br from-green-700 to-teal-700 p-6 rounded-xl shadow-xl flex items-center justify-between" data-aos="fade-up" data-aos-delay="300">
            <div>
              <p className="text-gray-200 text-sm font-medium">Total Deposits</p>
              <p className="text-yellow-300 text-3xl font-bold">₹{getTotalDeposits()}</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-300 opacity-70" />
          </div>
          <button
            onClick={() => setShowDepositModal(true)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-purple-900 font-bold py-4 px-6 rounded-xl shadow-lg hover:from-yellow-400 hover:to-orange-400 transition duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
            data-aos="fade-up" data-aos-delay="400"
          >
            <Plus className="w-6 h-6" /> Make a Donation
          </button>
        </div>

        {/* Transactions Table */}
        <h2 className="text-3xl font-bold text-yellow-300 mb-6 flex items-center gap-2" data-aos="fade-right">
          <BarChart4 className="w-7 h-7" /> Your Transactions
        </h2>
        {transactions.length === 0 ? (
          <p className="text-gray-300 text-center py-10" data-aos="fade-up">No transactions recorded yet. Make your first deposit!</p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-xl border border-white border-opacity-20" data-aos="fade-up" data-aos-delay="500">
            <table className="min-w-full bg-white bg-opacity-5 rounded-xl">
              <thead>
                <tr className="bg-white bg-opacity-10 text-gray-200 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Guru Dev</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Purpose</th>
                  <th className="py-3 px-6 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm font-light">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition duration-200">
                    <td className="py-3 px-6 text-left whitespace-nowrap flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      {new Date(txn.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {txn.guruDevId ? GURU_DEVS.find(g => g.id === txn.guruDevId)?.name : 'N/A'}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {GENERAL_DONATION_CATEGORIES.find(c => c.id === txn.generalCategory)?.name || txn.generalCategory}
                    </td>
                    <td className="py-3 px-6 text-left flex items-center gap-2">
                      {getSpecificPurposeIcon(txn.specificPurpose)}
                      {SPECIFIC_DONATION_PURPOSES.find(p => p.id === txn.specificPurpose)?.name || txn.specificPurpose}
                    </td>
                    <td className="py-3 px-6 text-right font-semibold text-yellow-200">
                      ₹{txn.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4">
          <div className="bg-gradient-to-br from-indigo-800 to-purple-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-indigo-700 backdrop-filter backdrop-blur-md" data-aos="zoom-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-300 flex items-center gap-2">
                <Wallet className="w-8 h-8" /> Make a Donation
              </h2>
              <button onClick={() => setShowDepositModal(false)} className="text-gray-300 hover:text-white transition duration-300">
                <X className="w-7 h-7" />
              </button>
            </div>
            <form onSubmit={handleDeposit} className="space-y-5">
              <div>
                <label className="block text-gray-200 text-sm font-semibold mb-2" htmlFor="general-category">
                  <BookOpen className="inline-block w-4 h-4 mr-2" /> Select General Category
                </label>
                <div className="relative">
                  <select
                    id="general-category"
                    className="w-full p-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 pr-10"
                    value={selectedGeneralCategory}
                    onChange={(e) => setSelectedGeneralCategory(e.target.value)}
                    required
                  >
                    {GENERAL_DONATION_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id} className="bg-purple-900 text-white">
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              {selectedGeneralCategory === 'guru-seva' && (
                <div>
                  <label className="block text-gray-200 text-sm font-semibold mb-2" htmlFor="guru-dev">
                    <Star className="inline-block w-4 h-4 mr-2" /> Select Guru Dev
                  </label>
                  <div className="relative">
                    <select
                      id="guru-dev"
                      className="w-full p-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 pr-10"
                      value={selectedGuruDevId}
                      onChange={(e) => setSelectedGuruDevId(e.target.value)}
                      required
                    >
                      {GURU_DEVS.map((guru) => (
                        <option key={guru.id} value={guru.id} className="bg-purple-900 text-white">
                          {guru.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              )}

              <div>
                <label className="block text-gray-200 text-sm font-semibold mb-2" htmlFor="specific-purpose">
                  <ScrollText className="inline-block w-4 h-4 mr-2" /> Purpose of Donation
                </label>
                <div className="relative">
                  <select
                    id="specific-purpose"
                    className="w-full p-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 pr-10"
                    value={selectedSpecificPurpose}
                    onChange={(e) => setSelectedSpecificPurpose(e.target.value)}
                    required
                  >
                    {SPECIFIC_DONATION_PURPOSES.map((purpose) => (
                      <option key={purpose.id} value={purpose.id} className="bg-purple-900 text-white">
                        {purpose.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-200 text-sm font-semibold mb-2" htmlFor="amount">
                  <DollarSign className="inline-block w-4 h-4 mr-2" /> Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  className="w-full p-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300"
                  placeholder="e.g., 100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-purple-900 font-bold py-3 px-4 rounded-lg shadow-lg hover:from-yellow-400 hover:to-orange-400 transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-purple-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <Banknote className="w-5 h-5" /> Confirm Donation
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4">
          <div className="bg-gradient-to-br from-blue-800 to-purple-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-blue-700 backdrop-filter backdrop-blur-md" data-aos="zoom-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-300 flex items-center gap-2">
                <ReceiptText className="w-8 h-8" /> Donation Receipt
              </h2>
              <button onClick={() => setShowReceipt(false)} className="text-gray-300 hover:text-white transition duration-300">
                <X className="w-7 h-7" />
              </button>
            </div>
            <div ref={receiptRef} className="bg-white text-gray-800 p-6 rounded-lg shadow-inner">
              <h3 className="text-xl font-bold text-center mb-4 text-purple-800">Official Receipt</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Transaction ID:</span>
                  <span>{receiptData.transactionId}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Date:</span>
                  <span>{receiptData.date}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Devotee Name:</span>
                  <span>{receiptData.devoteeName}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Guru Dev:</span>
                  <span>{receiptData.guruDevName}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Category:</span>
                  <span>{receiptData.generalCategory}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Purpose:</span>
                  <span>{receiptData.specificPurpose}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Amount:</span>
                  <span className="text-green-600">₹{receiptData.amount}</span>
                </div>
              </div>
              <p className="text-center mt-6 text-purple-700 font-medium italic">{receiptData.message}</p>
            </div>
            <button
              onClick={printReceipt}
              className="w-full mt-6 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-teal-400 hover:to-blue-400 transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" /> Print Receipt
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// GuruDevDashboard component
const GuruDevDashboard = ({ currentUser, allTransactions, GURU_DEVS, ashramEvents, SPECIFIC_DONATION_PURPOSES, GENERAL_DONATION_CATEGORIES }) => {
  // Filter transactions relevant to the current Guru Dev (where they were selected as the GuruDevId)
  const guruDevTransactions = allTransactions.filter(
    (txn) => txn.guruDevId === currentUser.id
  );

  const totalGuruDevDonations = guruDevTransactions.reduce(
    (sum, txn) => sum + txn.amount, 0
  ).toFixed(2);

  const getSpecificPurposeIcon = (purposeId) => {
    const purpose = SPECIFIC_DONATION_PURPOSES.find(p => p.id === purposeId);
    return purpose ? purpose.icon : <Sparkles className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white border-opacity-20" data-aos="fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-white border-opacity-20">
        <h1 className="text-4xl font-extrabold text-yellow-300 mb-4 sm:mb-0 flex items-center gap-3" data-aos="fade-right">
          <Star className="w-10 h-10" /> Guru Dev Dashboard
        </h1>
        <div className="text-lg font-semibold text-gray-200" data-aos="fade-left">
          Welcome, <span className="text-yellow-300">{currentUser?.name || 'Guru Dev'}</span>!
        </div>
      </div>

      {/* Ashram Events / Notifications */}
      {ashramEvents.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg shadow-md mb-8 text-white" data-aos="fade-down">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <BellRing className="w-6 h-6 animate-pulse" /> Upcoming Ashram Events
          </h3>
          <ul className="list-disc pl-5">
            {ashramEvents.slice(0, 3).map((event, index) => ( // Show top 3 events
              <li key={event.id} className="mb-1 text-sm">
                <span className="font-semibold">{event.name}</span> on {event.date} - {event.description}
                </li>
              ))}
              {ashramEvents.length > 3 && (
                <li className="text-sm italic">And more...</li>
              )}
            </ul>
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-700 to-indigo-700 p-6 rounded-xl shadow-xl flex items-center justify-between" data-aos="fade-up" data-aos-delay="200">
          <div>
            <p className="text-gray-200 text-sm font-medium">Your Guru Dev ID</p>
            <p className="text-yellow-300 text-xl font-bold break-all">{currentUser?.id || 'N/A'}</p>
          </div>
          <User className="w-10 h-10 text-purple-300 opacity-70" />
        </div>
        <div className="bg-gradient-to-br from-green-700 to-teal-700 p-6 rounded-xl shadow-xl flex items-center justify-between" data-aos="fade-up" data-aos-delay="300">
          <div>
            <p className="text-gray-200 text-sm font-medium">Total Donations Received</p>
            <p className="text-yellow-300 text-3xl font-bold">₹{totalGuruDevDonations}</p>
          </div>
          <DollarSign className="w-10 h-10 text-green-300 opacity-70" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-yellow-300 mb-6 flex items-center gap-2" data-aos="fade-right">
        <BarChart4 className="w-7 h-7" /> Your Donations Received
      </h2>
      {guruDevTransactions.length === 0 ? (
        <p className="text-gray-300 text-center py-10" data-aos="fade-up">No donations received yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-xl border border-white border-opacity-20" data-aos="fade-up" data-aos-delay="400">
          <table className="min-w-full bg-white bg-opacity-5 rounded-xl">
            <thead>
              <tr className="bg-white bg-opacity-10 text-gray-200 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Devotee Name</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Purpose</th>
                <th className="py-3 px-6 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-sm font-light">
              {guruDevTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition duration-200">
                  <td className="py-3 px-6 text-left whitespace-nowrap flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    {new Date(txn.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {txn.devoteeName}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {GENERAL_DONATION_CATEGORIES.find(c => c.id === txn.generalCategory)?.name || txn.generalCategory}
                  </td>
                  <td className="py-3 px-6 text-left flex items-center gap-2">
                    {getSpecificPurposeIcon(txn.specificPurpose)}
                    {SPECIFIC_DONATION_PURPOSES.find(p => p.id === txn.specificPurpose)?.name || txn.specificPurpose}
                  </td>
                  <td className="py-3 px-6 text-right font-semibold text-yellow-200">
                    ₹{txn.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// InventoryManager component for Admin
const InventoryManager = ({ setMessage }) => {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [editingItem, setEditingItem] = useState(null); // Stores the item being edited

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    try {
      const storedInventory = localStorage.getItem('ashram_inventory');
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      }
    } catch (error) {
      console.error("Error loading inventory from localStorage:", error);
      setMessage("Failed to load inventory.");
    }
  };

  const saveInventory = (newInventory) => {
    try {
      localStorage.setItem('ashram_inventory', JSON.stringify(newInventory));
      setInventory(newInventory);
    } catch (error) {
      console.error("Error saving inventory to localStorage:", error);
      setMessage("Failed to save inventory locally.");
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName || isNaN(parseInt(itemQuantity)) || parseInt(itemQuantity) < 0 || isNaN(parseFloat(itemPrice)) || parseFloat(itemPrice) < 0) {
      setMessage('Please enter valid item name, quantity, and price.');
      return;
    }

    const newItem = {
      id: 'INV' + Date.now() + Math.random().toString(36).substr(2, 9),
      name: itemName,
      quantity: parseInt(itemQuantity),
      price: parseFloat(itemPrice).toFixed(2),
    };
    const updatedInventory = [...inventory, newItem];
    saveInventory(updatedInventory);
    setMessage('Item added successfully!');
    setItemName('');
    setItemQuantity('');
    setItemPrice('');
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemQuantity(item.quantity);
    setItemPrice(item.price);
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    if (!itemName || isNaN(parseInt(itemQuantity)) || parseInt(itemQuantity) < 0 || isNaN(parseFloat(itemPrice)) || parseFloat(itemPrice) < 0) {
      setMessage('Please enter valid item name, quantity, and price.');
      return;
    }

    const updatedInventory = inventory.map(item =>
      item.id === editingItem.id
        ? { ...item, name: itemName, quantity: parseInt(itemQuantity), price: parseFloat(itemPrice).toFixed(2) }
        : item
    );
    saveInventory(updatedInventory);
    setMessage('Item updated successfully!');
    setEditingItem(null);
    setItemName('');
    setItemQuantity('');
    setItemPrice('');
  };

  const handleDeleteItem = (id) => {
    const updatedInventory = inventory.filter(item => item.id !== id);
    saveInventory(updatedInventory);
    setMessage('Item deleted successfully!');
  };

  return (
    <div className="bg-white bg-opacity-5 p-6 rounded-xl shadow-inner border border-white border-opacity-20" data-aos="fade-up">
      <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-2">
        <ClipboardList className="w-6 h-6" /> Inventory Management
      </h3>

      {/* Add/Edit Item Form */}
      <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4 mb-8 p-4 bg-white bg-opacity-10 rounded-lg shadow-md">
        <div>
          <label className="block text-gray-200 text-sm font-semibold mb-1" htmlFor="itemName">Item Name</label>
          <input
            type="text"
            id="itemName"
            className="w-full p-2 rounded-md bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g., Incense Sticks"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-200 text-sm font-semibold mb-1" htmlFor="itemQuantity">Quantity</label>
            <input
              type="number"
              id="itemQuantity"
              className="w-full p-2 rounded-md bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-gray-200 text-sm font-semibold mb-1" htmlFor="itemPrice">Price (₹)</label>
            <input
              type="number"
              id="itemPrice"
              className="w-full p-2 rounded-md bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:from-blue-400 hover:to-teal-400 transition duration-300 flex items-center justify-center gap-2"
        >
          {editingItem ? (
            <>
              <Settings className="w-5 h-5" /> Update Item
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" /> Add Item
            </>
          )}
        </button>
        {editingItem && (
          <button
            type="button"
            onClick={() => { setEditingItem(null); setItemName(''); setItemQuantity(''); setItemPrice(''); }}
            className="w-full mt-2 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" /> Cancel Edit
          </button>
        )}
      </form>

      {/* Inventory List */}
      {inventory.length === 0 ? (
        <p className="text-gray-300 text-center py-10">No inventory items added yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-xl border border-white border-opacity-20">
          <table className="min-w-full bg-white bg-opacity-5 rounded-xl">
            <thead>
              <tr className="bg-white bg-opacity-10 text-gray-200 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Item Name</th>
                <th className="py-3 px-6 text-right">Quantity</th>
                <th className="py-3 px-6 text-right">Price (₹)</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-sm font-light">
              {inventory.map((item) => (
                <tr key={item.id} className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition duration-200">
                  <td className="py-3 px-6 text-left">{item.name}</td>
                  <td className="py-3 px-6 text-right">{item.quantity}</td>
                  <td className="py-3 px-6 text-right">₹{item.price}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-blue-400 hover:text-blue-300 transition duration-300"
                        title="Edit Item"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-400 hover:text-red-300 transition duration-300"
                        title="Delete Item"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// AshramEventsManager component for Admin
const AshramEventsManager = ({ ashramEvents, saveAshramEvents, setMessage }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventName || !eventDate || !eventDescription) {
      setMessage('Please fill all event fields.');
      return;
    }

    const newEvent = {
      id: 'EVT' + Date.now() + Math.random().toString(36).substr(2, 9),
      name: eventName,
      date: eventDate,
      description: eventDescription,
    };
    const updatedEvents = [...ashramEvents, newEvent];
    saveAshramEvents(updatedEvents);
    setMessage('Event added successfully!');
    setEventName('');
    setEventDate('');
    setEventDescription('');
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventName(event.name);
    setEventDate(event.date);
    setEventDescription(event.description);
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    if (!eventName || !eventDate || !eventDescription) {
      setMessage('Please fill all event fields.');
      return;
    }

    const updatedEvents = ashramEvents.map(event =>
      event.id === editingEvent.id
        ? { ...event, name: eventName, date: eventDate, description: eventDescription }
        : event
    );
    saveAshramEvents(updatedEvents);
    setMessage('Event updated successfully!');
    setEditingEvent(null);
    setEventName('');
    setEventDate('');
    setEventDescription('');
  };

  const handleDeleteEvent = (id) => {
    const updatedEvents = ashramEvents.filter(event => event.id !== id);
    saveAshramEvents(updatedEvents);
    setMessage('Event deleted successfully!');
  };

  return (
    <div className="bg-white bg-opacity-5 p-6 rounded-xl shadow-inner border border-white border-opacity-20" data-aos="fade-up">
      <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-2">
        <CalendarCheck className="w-6 h-6" /> Ashram Events Management
      </h3>

      {/* Add/Edit Event Form */}
      <form onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent} className="space-y-4 mb-8 p-4 bg-white bg-opacity-10 rounded-lg shadow-md">
        <div>
          <label className="block text-gray-200 text-sm font-semibold mb-1" htmlFor="eventName">Event Name</label>
          <input
            type="text"
            id="eventName"
            className="w-full p-2 rounded-md bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., Annual Satsang"
            required
          />
        </div>
        <div>
          <label className="block text-gray-200 text-sm font-semibold mb-1" htmlFor="eventDate">Event Date</label>
          <input
            type="date"
            id="eventDate"
            className="w-full p-2 rounded-md bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-200 text-sm font-semibold mb-1" htmlFor="eventDescription">Description</label>
          <textarea
            id="eventDescription"
            rows="3"
            className="w-full p-2 rounded-md bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Brief description of the event..."
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:from-blue-400 hover:to-teal-400 transition duration-300 flex items-center justify-center gap-2"
        >
          {editingEvent ? (
            <>
              <Settings className="w-5 h-5" /> Update Event
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" /> Add Event
            </>
          )}
        </button>
        {editingEvent && (
          <button
            type="button"
            onClick={() => { setEditingEvent(null); setEventName(''); setEventDate(''); setEventDescription(''); }}
            className="w-full mt-2 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" /> Cancel Edit
          </button>
        )}
      </form>

      {/* Event List */}
      {ashramEvents.length === 0 ? (
        <p className="text-gray-300 text-center py-10">No events added yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-xl border border-white border-opacity-20">
          <table className="min-w-full bg-white bg-opacity-5 rounded-xl">
            <thead>
              <tr className="bg-white bg-opacity-10 text-gray-200 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Event Name</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-sm font-light">
              {ashramEvents.map((event) => (
                <tr key={event.id} className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition duration-200">
                  <td className="py-3 px-6 text-left">{event.name}</td>
                  <td className="py-3 px-6 text-left">{event.date}</td>
                  <td className="py-3 px-6 text-left">{event.description}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-blue-400 hover:text-blue-300 transition duration-300"
                        title="Edit Event"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-400 hover:text-red-300 transition duration-300"
                        title="Delete Event"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// DevoteeManagement component for Admin
const DevoteeManagement = ({ ALL_USERS, allTransactions }) => {
  // Filter only devotee users
  const devoteeUsers = ALL_USERS.filter(user => user.role === 'devotee');

  // Calculate total transactions per devotee
  const devoteeTransactionSummary = devoteeUsers.map(devotee => {
    const transactions = allTransactions.filter(txn => txn.devoteeId === devotee.id);
    const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0).toFixed(2);
    const numberOfTransactions = transactions.length;
    return {
      ...devotee,
      totalAmountDonated: totalAmount,
      numberOfTransactions: numberOfTransactions
    };
  });

  return (
    <div className="bg-white bg-opacity-5 p-6 rounded-xl shadow-inner border border-white border-opacity-20" data-aos="fade-up">
      <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6" /> Devotee Management
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-700 to-purple-700 p-6 rounded-xl shadow-xl flex items-center justify-between" data-aos="fade-up" data-aos-delay="100">
          <div>
            <p className="text-gray-200 text-sm font-medium">Total Registered Devotees</p>
            <p className="text-yellow-300 text-3xl font-bold">{devoteeUsers.length}</p>
          </div>
          <Users className="w-10 h-10 text-indigo-300 opacity-70" />
        </div>
        <div className="bg-gradient-to-br from-pink-700 to-red-700 p-6 rounded-xl shadow-xl flex items-center justify-between" data-aos="fade-up" data-aos-delay="200">
          <div>
            <p className="text-gray-200 text-sm font-medium">Devotees with Donations</p>
            <p className="text-yellow-300 text-3xl font-bold">
              {new Set(allTransactions.filter(txn => ALL_USERS.find(u => u.id === txn.devoteeId)?.role === 'devotee').map(txn => txn.devoteeId)).size}
            </p>
          </div>
          <Handshake className="w-10 h-10 text-pink-300 opacity-70" />
        </div>
      </div>

      <h4 className="text-xl font-bold text-yellow-200 mb-4 flex items-center gap-2">
        <User className="w-5 h-5" /> Devotee Details
      </h4>
      {devoteeTransactionSummary.length === 0 ? (
        <p className="text-gray-300 text-center py-6">No devotee data available.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-xl border border-white border-opacity-20">
          <table className="min-w-full bg-white bg-opacity-5 rounded-xl">
            <thead>
              <tr className="bg-white bg-opacity-10 text-gray-200 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Devotee Name</th>
                <th className="py-3 px-6 text-left">Devotee ID</th>
                <th className="py-3 px-6 text-right">Total Donated (₹)</th>
                <th className="py-3 px-6 text-right">No. of Transactions</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-sm font-light">
              {devoteeTransactionSummary.map((devotee) => (
                <tr key={devotee.id} className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition duration-200">
                  <td className="py-3 px-6 text-left">{devotee.name}</td>
                  <td className="py-3 px-6 text-left break-all">{devotee.id}</td>
                  <td className="py-3 px-6 text-right font-semibold text-yellow-200">
                    ₹{devotee.totalAmountDonated}
                  </td>
                  <td className="py-3 px-6 text-right">{devotee.numberOfTransactions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


// AdminDashboard component
const AdminDashboard = ({ currentUser, allTransactions, GURU_DEVS, GENERAL_DONATION_CATEGORIES, SPECIFIC_DONATION_PURPOSES, setMessage, ashramEvents, saveAshramEvents, ALL_USERS }) => {
  const [activeTab, setActiveTab] = useState('donation-reports'); // Default tab to donation reports

  // Calculate total donations for each Guru Dev
  const guruDevDonationSummary = GURU_DEVS.map(guru => {
    const total = allTransactions
      .filter(txn => txn.guruDevId === guru.id) // Filter by GuruDevId for all purposes
      .reduce((sum, txn) => sum + txn.amount, 0);
    return { ...guru, totalDonations: total.toFixed(2) };
  });

  // Calculate total overall donations
  const totalOverallDonations = allTransactions.reduce((sum, txn) => sum + txn.amount, 0).toFixed(2);

  // Helper to get specific purpose icon
  const getSpecificPurposeIcon = (purposeId) => {
    const purpose = SPECIFIC_DONATION_PURPOSES.find(p => p.id === purposeId);
    return purpose ? purpose.icon : <Sparkles className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white border-opacity-20 flex flex-col md:flex-row" data-aos="fade-up">
      {/* Sidebar for Admin Panel */}
      <div className="md:w-1/4 w-full bg-white bg-opacity-5 rounded-xl p-4 md:mr-6 mb-6 md:mb-0 shadow-lg border border-white border-opacity-20" data-aos="fade-right">
        <h2 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6" /> Admin Tools
        </h2>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => setActiveTab('donation-reports')}
              className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition duration-300 flex items-center gap-3 ${
                activeTab === 'donation-reports'
                  ? 'bg-purple-700 text-yellow-300 shadow-md'
                  : 'text-gray-200 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <BarChart4 className="w-5 h-5" /> Donation Reports
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('all-transactions')}
              className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition duration-300 flex items-center gap-3 ${
                activeTab === 'all-transactions'
                  ? 'bg-purple-700 text-yellow-300 shadow-md'
                  : 'text-gray-200 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <TrendingUp className="w-5 h-5" /> All Transactions
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition duration-300 flex items-center gap-3 ${
                activeTab === 'inventory'
                  ? 'bg-purple-700 text-yellow-300 shadow-md'
                  : 'text-gray-200 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Package className="w-5 h-5" /> Inventory
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('devotee-management')}
              className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition duration-300 flex items-center gap-3 ${
                activeTab === 'devotee-management'
                  ? 'bg-purple-700 text-yellow-300 shadow-md'
                  : 'text-gray-200 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Users className="w-5 h-5" /> Devotee Management
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('ashram-events')}
              className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition duration-300 flex items-center gap-3 ${
                activeTab === 'ashram-events'
                  ? 'bg-purple-700 text-yellow-300 shadow-md'
                  : 'text-gray-200 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <CalendarCheck className="w-5 h-5" /> Ashram Events
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="md:w-3/4 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-white border-opacity-20">
          <h1 className="text-4xl font-extrabold text-yellow-300 mb-4 sm:mb-0 flex items-center gap-3" data-aos="fade-right">
            <ShieldCheck className="w-10 h-10" /> Admin Dashboard
          </h1>
          <div className="text-lg font-semibold text-gray-200" data-aos="fade-left">
            Welcome, <span className="text-yellow-300">{currentUser?.name || 'Admin'}</span>!
          </div>
        </div>

        {activeTab === 'donation-reports' && (
          <div className="bg-white bg-opacity-5 p-6 rounded-xl shadow-inner border border-white border-opacity-20" data-aos="fade-up">
            <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-2">
              <BarChart4 className="w-6 h-6" /> Donation Overview
            </h3>

            <div className="bg-gradient-to-br from-green-700 to-teal-700 p-6 rounded-xl shadow-xl flex items-center justify-between mb-8" data-aos="fade-up" data-aos-delay="100">
              <div>
                <p className="text-gray-200 text-sm font-medium">Total Overall Donations</p>
                <p className="text-yellow-300 text-3xl font-bold">₹{totalOverallDonations}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-300 opacity-70" />
            </div>

            <h4 className="text-xl font-bold text-yellow-200 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" /> Guru Dev Donation Summary
            </h4>
            {guruDevDonationSummary.length === 0 ? (
              <p className="text-gray-300 text-center py-6">No Guru Dev donations recorded yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow-xl border border-white border-opacity-20">
                <table className="min-w-full bg-white bg-opacity-5 rounded-xl">
                  <thead>
                    <tr className="bg-white bg-opacity-10 text-gray-200 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Guru Dev Name</th>
                      <th className="py-3 px-6 text-right">Total Donations (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300 text-sm font-light">
                    {guruDevDonationSummary.map((guru) => (
                      <tr key={guru.id} className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition duration-200">
                        <td className="py-3 px-6 text-left">{guru.name}</td>
                        <td className="py-3 px-6 text-right font-semibold text-yellow-200">
                          ₹{guru.totalDonations}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'all-transactions' && (
          <div className="bg-white bg-opacity-5 p-6 rounded-xl shadow-inner border border-white border-opacity-20" data-aos="fade-up">
            <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" /> All Ashram Transactions
            </h3>
            {allTransactions.length === 0 ? (
              <p className="text-gray-300 text-center py-10">No transactions recorded across the ashram yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow-xl border border-white border-opacity-20">
                <table className="min-w-full bg-white bg-opacity-5 rounded-xl">
                  <thead>
                    <tr className="bg-white bg-opacity-10 text-gray-200 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Date</th>
                      <th className="py-3 px-6 text-left">Devotee</th>
                      <th className="py-3 px-6 text-left">Guru Dev</th>
                      <th className="py-3 px-6 text-left">Category</th>
                      <th className="py-3 px-6 text-left">Purpose</th>
                      <th className="py-3 px-6 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300 text-sm font-light">
                    {allTransactions.map((txn) => (
                      <tr key={txn.id} className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition duration-200">
                        <td className="py-3 px-6 text-left whitespace-nowrap flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-gray-400" />
                          {new Date(txn.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {txn.devoteeName}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {txn.guruDevId ? GURU_DEVS.find(g => g.id === txn.guruDevId)?.name : 'N/A'}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {GENERAL_DONATION_CATEGORIES.find(c => c.id === txn.generalCategory)?.name || txn.generalCategory}
                        </td>
                        <td className="py-3 px-6 text-left flex items-center gap-2">
                          {getSpecificPurposeIcon(txn.specificPurpose)}
                          {SPECIFIC_DONATION_PURPOSES.find(p => p.id === txn.specificPurpose)?.name || txn.specificPurpose}
                        </td>
                        <td className="py-3 px-6 text-right font-semibold text-yellow-200">
                          ₹{txn.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && <InventoryManager setMessage={setMessage} />}

        {activeTab === 'devotee-management' && <DevoteeManagement ALL_USERS={ALL_USERS} allTransactions={allTransactions} />}

        {activeTab === 'ashram-events' && <AshramEventsManager ashramEvents={ashramEvents} saveAshramEvents={saveAshramEvents} setMessage={setMessage} />}
      </div>
    </div>
  );
};


// --- Main App Component ---
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Stores user data or ID
  const [allTransactions, setAllTransactions] = useState([]); // Stores ALL transactions
  const [ashramEvents, setAshramEvents] = useState([]); // Stores ALL ashram events
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAppReady, setIsAppReady] = useState(false);

  // Hardcoded users for demonstration purposes
  const ALL_USERS = [
    { username: 'devotee@example.com', password: 'password123', name: 'Devotee Bhakt', id: 'devotee@example.com', role: 'devotee' },
    { username: 'devotee2@example.com', password: 'password123', name: 'Devotee Seeker', id: 'devotee2@example.com', role: 'devotee' },
    { username: 'gurudev@example.com', password: 'guru123', name: 'Ritwik', id: 'guru-vivekananda', role: 'guru' },
    { username: 'gurudev2@example.com', password: 'guru123', name: 'Guru Nanak', id: 'guru-nanak', role: 'guru' },
    { username: 'admin@example.com', password: 'admin123', name: 'Admin Maharaj', id: 'admin@example.com', role: 'admin' },
  ];

  // General Categories for donations
  const GENERAL_DONATION_CATEGORIES = [
    { id: 'guru-seva', name: 'Guru Seva', icon: <Star className="w-5 h-5 text-yellow-400" /> },
    { id: 'temple-maintenance', name: 'Temple Maintenance', icon: <Home className="w-5 h-5 text-blue-400" /> },
    { id: 'charity', name: 'Charity & Community', icon: <HeartHandshake className="w-5 h-5 text-pink-400" /> },
    { id: 'education', name: 'Spiritual Education', icon: <BookOpen className="w-5 h-5 text-green-400" /> },
    { id: 'general-fund', name: 'General Fund', icon: <Banknote className="w-5 h-5 text-gray-400" /> },
  ];

  // Specific Purposes for donations (the new list provided by the user)
  const SPECIFIC_DONATION_PURPOSES = [
    { id: 'swastyami', name: 'Swastyami', icon: <Sparkles className="w-5 h-5 text-yellow-400" /> },
    { id: 'istavriti', name: 'Istavriti', icon: <HeartHandshake className="w-5 h-5 text-pink-400" /> },
    { id: 'swasti-a', name: 'Swasti-A', icon: <Award className="w-5 h-5 text-amber-400" /> },
    { id: 'y-argha', name: 'Y-Argha', icon: <ScrollText className="w-5 h-5 text-blue-400" /> },
    { id: 'dakshina', name: 'Dakshina', icon: <PiggyBank className="w-5 h-5 text-green-400" /> },
    { id: 'sangathani', name: 'Sangathani', icon: <Briefcase className="w-5 h-5 text-purple-400" /> },
    { id: 'pranami', name: 'Pranami', icon: <Feather className="w-5 h-5 text-teal-400" /> },
    { id: 'tapovan', name: 'Tapovan', icon: <Landmark className="w-5 h-5 text-brown-400" /> },
    { id: 'a-bazar', name: 'A-Bazar', icon: <Globe className="w-5 h-5 text-gray-400" /> },
    { id: 'b.m', name: 'B.M', icon: <GraduationCap className="w-5 h-5 text-red-400" /> },
    { id: 'utsav', name: 'Utsav', icon: <Gift className="w-5 h-5 text-indigo-400" /> },
    { id: 'k.p', name: 'K.P', icon: <ClipboardCopy className="w-5 h-5 text-lime-400" /> },
    { id: 'k.b', name: 'K.B', icon: <BookUser className="w-5 h-5 text-cyan-400" /> },
    { id: 'ch.dis', name: 'Ch. Dis', icon: <FileText className="w-5 h-5 text-amber-400" /> },
    { id: 'ritwiki', name: 'Ritwiki', icon: <Star className="w-5 h-5 text-fuchsia-400" /> },
    { id: 's.v', name: 'S.V', icon: <Gem className="w-5 h-5 text-emerald-400" /> },
  ];

  // List of Guru Devs
  const GURU_DEVS = [
    { id: 'guru-vivekananda', name: 'Ritwik' },
    { id: 'guru-ramakrishna', name: 'Sri Ramakrishna Paramahamsa' },
    { id: 'guru-shankaracharya', name: 'Adi Shankara' },
    { id: 'guru-nanak', name: 'Guru Nanak' },
  ];


  // Initialize AOS and load data from localStorage on component mount
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
    });

    // Attempt to load user, ALL transactions, and ALL events from localStorage on initial load
    const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
    loadAllTransactions(); // Load all transactions globally
    loadAshramEvents(); // Load all ashram events globally

    if (storedLoggedIn && storedCurrentUser) {
      setIsLoggedIn(true);
      setCurrentUser(storedCurrentUser);
      setMessage(`Welcome back, ${storedCurrentUser.name}!`);
    }

    setIsAppReady(true); // Application is ready after initial checks
  }, []);

  // Function to load ALL transactions from localStorage
  const loadAllTransactions = () => {
    try {
      const storedTransactions = localStorage.getItem(`ashram_all_transactions`);
      if (storedTransactions) {
        const parsedTransactions = JSON.parse(storedTransactions);
        // Ensure timestamps are Date objects for sorting
        const transactionsWithDates = parsedTransactions.map(txn => ({
          ...txn,
          timestamp: new Date(txn.timestamp)
        }));
        // Sort by timestamp descending to show most recent first
        transactionsWithDates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setAllTransactions(transactionsWithDates);
      } else {
        setAllTransactions([]);
      }
    } catch (error) {
      console.error("Error loading all transactions from localStorage:", error);
      setAllTransactions([]); // Clear transactions on error
    } finally {
      setLoading(false);
    }
  };

  // Function to save ALL transactions to localStorage
  const saveAllTransactions = (newTransactions) => {
    try {
      localStorage.setItem(`ashram_all_transactions`, JSON.stringify(newTransactions));
      setAllTransactions(newTransactions); // Update global state
    } catch (error) {
      console.error("Error saving all transactions to localStorage:", error);
      setMessage("Failed to save transactions locally.");
    }
  };

  // Function to load ALL ashram events from localStorage
  const loadAshramEvents = () => {
    try {
      const storedEvents = localStorage.getItem('ashram_events');
      if (storedEvents) {
        setAshramEvents(JSON.parse(storedEvents));
      } else {
        setAshramEvents([]);
      }
    } catch (error) {
      console.error("Error loading ashram events from localStorage:", error);
      setAshramEvents([]);
    }
  };

  // Function to save ALL ashram events to localStorage
  const saveAshramEvents = (newEvents) => {
    try {
      localStorage.setItem('ashram_events', JSON.stringify(newEvents));
      setAshramEvents(newEvents);
    } catch (error) {
      console.error("Error saving ashram events to localStorage:", error);
      setMessage("Failed to save events locally.");
    }
  };

  const handleLogin = (username, password) => {
    setLoading(true);
    setMessage('');

    const foundUser = ALL_USERS.find(
      (user) => user.username === username && user.password === password
    );

    if (foundUser) {
      setIsLoggedIn(true);
      setCurrentUser(foundUser);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setMessage(`Welcome, ${foundUser.name}!`);
    } else {
      setMessage('Invalid username or password.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    setMessage('Logged out successfully.');
  };

  if (!isAppReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white font-inter">
        <div className="flex flex-col items-center p-8 rounded-xl shadow-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20" data-aos="zoom-in">
          <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse mb-4" />
          <p className="text-xl font-semibold">Initializing Application...</p>
          <p className="text-sm text-gray-300 mt-2">Connecting to the spiritual realm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white font-inter p-4 sm:p-6 lg:p-8">
      {/* Message Display */}
      {message && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 p-3 rounded-lg shadow-lg text-sm z-50 transition-all duration-300 transform ${
            message.includes('successful') ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
          data-aos="fade-down"
        >
          {message}
        </div>
      )}

      {/* Conditional Rendering of Login Modal or Dashboard */}
      {!isLoggedIn ? (
        <AuthModal handleLogin={handleLogin} loading={loading} message={message} ALL_USERS={ALL_USERS} />
      ) : (
        <>
          {/* Logout Button (visible on all dashboards) */}
          <div className="fixed top-4 right-4 z-50" data-aos="fade-left">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>

          {/* Render Dashboard based on user role */}
          {currentUser?.role === 'devotee' && (
            <DevoteeDashboard
              currentUser={currentUser}
              transactions={allTransactions.filter(txn => txn.devoteeId === currentUser.id)} // Pass only devotee's transactions
              setTransactions={setAllTransactions} // DevoteeDashboard will update allTransactions directly
              saveAllTransactions={saveAllTransactions} // Pass global save function
              GENERAL_DONATION_CATEGORIES={GENERAL_DONATION_CATEGORIES}
              SPECIFIC_DONATION_PURPOSES={SPECIFIC_DONATION_PURPOSES}
              GURU_DEVS={GURU_DEVS}
              setMessage={setMessage}
              ashramEvents={ashramEvents}
            />
          )}
          {currentUser?.role === 'guru' && (
            <GuruDevDashboard
              currentUser={currentUser}
              allTransactions={allTransactions} // Pass all transactions to GuruDevDashboard
              GURU_DEVS={GURU_DEVS}
              setMessage={setMessage}
              ashramEvents={ashramEvents}
              SPECIFIC_DONATION_PURPOSES={SPECIFIC_DONATION_PURPOSES}
              GENERAL_DONATION_CATEGORIES={GENERAL_DONATION_CATEGORIES}
            />
          )}
          {currentUser?.role === 'admin' && (
            <AdminDashboard
              currentUser={currentUser}
              allTransactions={allTransactions} // Pass all transactions to AdminDashboard
              GURU_DEVS={GURU_DEVS}
              GENERAL_DONATION_CATEGORIES={GENERAL_DONATION_CATEGORIES}
              SPECIFIC_DONATION_PURPOSES={SPECIFIC_DONATION_PURPOSES}
              setMessage={setMessage}
              ashramEvents={ashramEvents}
              saveAshramEvents={saveAshramEvents}
              ALL_USERS={ALL_USERS}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
