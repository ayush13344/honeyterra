import "./AdminTable.css";

function AdminTable({
  columns = [],
  data = [],
  renderActions,
  emptyMessage = "No data available.",
}) {
  return (
    <div className="admin-table-wrapper">

      <table className="admin-table">

        <thead>
          <tr>

            {columns.map((column) => (
              <th key={column.key}>
                {column.label}
              </th>
            ))}

            {renderActions && (
              <th className="admin-table-actions-heading">
                Actions
              </th>
            )}

          </tr>
        </thead>


        <tbody>

          {data.length === 0 ? (

            <tr>

              <td
                colSpan={
                  columns.length +
                  (renderActions ? 1 : 0)
                }
                className="admin-table-empty"
              >
                {emptyMessage}
              </td>

            </tr>

          ) : (

            data.map((row, index) => (

              <tr key={row.id || index}>

                {columns.map((column) => (

                  <td key={column.key}>

                    {column.render
                      ? column.render(
                          row[column.key],
                          row
                        )
                      : row[column.key]}

                  </td>

                ))}


                {renderActions && (
                  <td className="admin-table-actions">
                    {renderActions(row)}
                  </td>
                )}

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default AdminTable;