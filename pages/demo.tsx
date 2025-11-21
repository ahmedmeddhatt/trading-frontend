import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { PositionsAPI, Position } from "@/lib/api/positions";
import { TransactionsAPI, Transaction } from "@/lib/api/transactions";
import { AnalyticsAPI } from "@/lib/api/analytics";

export default function DemoPage() {
  // Auth
  const { user, login, register, logout, fetchMe } = useAuthStore();
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");

  // Positions
  const [positions, setPositions] = useState<Position[]>([]);
  const [newPositionCompany, setNewPositionCompany] = useState("");
  const [newPositionQty, setNewPositionQty] = useState(0);
  const [newPositionPrice, setNewPositionPrice] = useState(0);

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTxQty, setNewTxQty] = useState(0);
  const [newTxPrice, setNewTxPrice] = useState(0);
  const [selectedPositionId, setSelectedPositionId] = useState("");

  // Analytics
  const [summary, setSummary] = useState<any>();
  const [companyAnalytics, setCompanyAnalytics] = useState<any>();
  const [snapshots, setSnapshots] = useState<any[]>([]);

  // Fetch Positions
  const fetchPositions = async () => {
    const data = await PositionsAPI.getAll();
    setPositions(data);
  };

  // Fetch Transactions
  const fetchTransactions = async (positionId: string) => {
    const data = await TransactionsAPI.getAll(positionId);
    setTransactions(data);
  };

  // Fetch Analytics
  const fetchSummary = async () => {
    const data = await AnalyticsAPI.getSummary();
    setSummary(data);
  };

  const fetchCompany = async (companyName: string) => {
    const data = await AnalyticsAPI.getCompanyAnalytics(companyName);
    setCompanyAnalytics(data);
  };

  const fetchSnapshots = async () => {
    const data = await AnalyticsAPI.getSnapshots();
    setSnapshots(data);
  };

  useEffect(() => {
    if (user) {
      fetchPositions();
      fetchSummary();
      fetchSnapshots();
    }
  }, [user]);

  // Handlers
  const handleRegister = async () => {
    await register({ name: authName, email: authEmail, password: authPassword });
  };

  const handleLogin = async () => {
    await login({ email: authEmail, password: authPassword });
  };

  const handleAddPosition = async () => {
    if (!newPositionCompany || !newPositionQty || !newPositionPrice) return;
    await PositionsAPI.create({
      companyName: newPositionCompany,
      quantity: newPositionQty,
      stockPrice: newPositionPrice,
    });
    setNewPositionCompany("");
    setNewPositionQty(0);
    setNewPositionPrice(0);
    fetchPositions();
  };

  const handleAddTransaction = async () => {
    if (!selectedPositionId || !newTxQty || !newTxPrice) return;
    await TransactionsAPI.create({
      positionId: selectedPositionId,
      quantity: newTxQty,
      price: newTxPrice,
    });
    setNewTxQty(0);
    setNewTxPrice(0);
    fetchTransactions(selectedPositionId);
    fetchPositions(); // update positions after transaction
  };

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-3xl font-bold">Full Demo Page</h1>

      {/* Auth */}
      <div className="border p-4 rounded space-y-2">
        <h2 className="text-xl font-semibold">Auth</h2>
        {user ? (
          <div>
            <p>Logged in as {user.name}</p>
            <button onClick={logout} className="bg-red-500 text-white px-2 py-1 rounded">Logout</button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              placeholder="Name (for register)"
              value={authName}
              onChange={(e) => setAuthName(e.target.value)}
            />
            <input
              placeholder="Email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />
            <div className="space-x-2">
              <button onClick={handleRegister} className="bg-green-500 text-white px-2 py-1 rounded">Register</button>
              <button onClick={handleLogin} className="bg-blue-500 text-white px-2 py-1 rounded">Login</button>
            </div>
          </div>
        )}
      </div>

      {/* Positions */}
      {user && (
        <div className="border p-4 rounded space-y-2">
          <h2 className="text-xl font-semibold">Positions</h2>
          <div className="flex space-x-2">
            <input
              placeholder="Company"
              value={newPositionCompany}
              onChange={(e) => setNewPositionCompany(e.target.value)}
            />
            <input
              placeholder="Quantity"
              type="number"
              value={newPositionQty}
              onChange={(e) => setNewPositionQty(Number(e.target.value))}
            />
            <input
              placeholder="Price"
              type="number"
              value={newPositionPrice}
              onChange={(e) => setNewPositionPrice(Number(e.target.value))}
            />
            <button onClick={handleAddPosition} className="bg-blue-500 text-white px-2 py-1 rounded">Add Position</button>
          </div>

          <table className="table-auto w-full mt-2 border">
            <thead>
              <tr className="bg-gray-200">
                <th>Company</th>
                <th>Qty</th>
                <th>Stock Price</th>
                <th>Investment</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
            {!positions || !Array.isArray(positions) ? (
            <tr>
                <td colSpan={5}>No data / still loading</td>
            </tr>
            ) : (
            positions.map((p) => (
                <tr key={p._id}>
                <td>{p.companyName}</td>
                <td>{p.quantity}</td>
                <td>{p.investmentWithTax}</td>
                <td>{p.resultWithTax}</td>
                </tr>
            ))
            )}

            </tbody>
          </table>
        </div>
      )}

      {/* Transactions */}
      {user && positions.length > 0 && (
        <div className="border p-4 rounded space-y-2">
          <h2 className="text-xl font-semibold">Transactions</h2>
          <div className="flex space-x-2">
            <select
              value={selectedPositionId}
              onChange={(e) => setSelectedPositionId(e.target.value)}
            >
              <option value="">Select Position</option>
              {positions.map((p) => (
                <option key={p._id} value={p._id}>{p.companyName}</option>
              ))}
            </select>
            <input
              placeholder="Quantity"
              type="number"
              value={newTxQty}
              onChange={(e) => setNewTxQty(Number(e.target.value))}
            />
            <input
              placeholder="Price"
              type="number"
              value={newTxPrice}
              onChange={(e) => setNewTxPrice(Number(e.target.value))}
            />
            <button onClick={handleAddTransaction} className="bg-green-500 text-white px-2 py-1 rounded">Add Transaction</button>
          </div>

          <table className="table-auto w-full mt-2 border">
            <thead>
              <tr className="bg-gray-200">
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-t">
                  <td>{t.quantity}</td>
                  <td>{t.price}</td>
                  <td>{t.total}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Analytics */}
      {user && summary && (
        <div className="border p-4 rounded space-y-2">
          <h2 className="text-xl font-semibold">Analytics Summary</h2>
          <p>Total Investment: {summary.totalInvestment}</p>
          <p>Total Result: {summary.totalResult}</p>
          <p>Total Gain/Loss: {summary.totalGainLoss}</p>
          <p>Total Percent: {summary.totalPercent.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}
