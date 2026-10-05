import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// NOTE: jsPDF's built-in fonts can't render ₹, so we use "Rs" in the PDF.
export function downloadTransactionsPDF(expenses, incomes, summary) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('ExpenseWise - Transaction Report', 14, 18);
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 24);

  doc.setTextColor(30);
  doc.setFontSize(10);
  doc.text(
    `Total income: Rs ${Number(summary.totalIncome || 0).toFixed(2)}    ` +
    `Total expenses: Rs ${Number(summary.totalExpense || 0).toFixed(2)}    ` +
    `Balance: Rs ${Number(summary.balance || 0).toFixed(2)}`,
    14, 31
  );

  const rows = [
    ...expenses.map((e) => ['Expense', e.title, e.category, e.paymentMethod || '-',
      new Date(e.date).toLocaleDateString('en-IN'), `-Rs ${Number(e.amount).toFixed(2)}`]),
    ...incomes.map((i) => ['Income', i.title, i.category, '-',
      new Date(i.date).toLocaleDateString('en-IN'), `+Rs ${Number(i.amount).toFixed(2)}`]),
  ].sort((a, b) => new Date(b[4].split('-').reverse().join('-')) - new Date(a[4].split('-').reverse().join('-')));

  autoTable(doc, {
    startY: 37,
    head: [['Type', 'Title', 'Category', 'Method', 'Date', 'Amount']],
    body: rows.length ? rows : [['-', 'No transactions yet', '-', '-', '-', '-']],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [244, 247, 251] },
  });

  doc.save(`ExpenseWise-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
}