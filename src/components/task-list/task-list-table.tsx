import React from "react";
import classnames from "classnames";

import styles from "./task-list-table.module.css";
import { Task, ListColumn } from "../../types/public-types";
import { getPathValue } from "../../helpers/other-helper";

// const localeDateStringCache = {};
// const toLocaleDateStringFactory = (locale: string) => (
//   date: Date,
//   dateTimeOptions: Intl.DateTimeFormatOptions
// ) => {
//   const key = date.toString();
//   let lds = localeDateStringCache[key];
//   if (!lds) {
//     lds = date.toLocaleDateString(locale, dateTimeOptions);
//     localeDateStringCache[key] = lds;
//   }
//   return lds;
// };
// const dateTimeOptions: Intl.DateTimeFormatOptions = {
//   weekday: "short",
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// };

function isRenderCell(data: any) {
  return (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    !React.isValidElement(data)
  );
}

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
  listColumns: ListColumn[];
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  // locale,
  onExpanderClick,
  listColumns,
}) => {
  // const toLocaleDateString = useMemo(() => toLocaleDateStringFactory(locale), [
  //   locale,
  // ]);

  return (
    <table
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        width: rowWidth,
      }}
    >
      <tbody>
        {tasks.map((t, index) => {
          let expanderSymbol = "";
          if (t.hideChildren === false) {
            expanderSymbol = "▼";
          } else if (t.hideChildren === true) {
            expanderSymbol = "▶";
          }

          return (
            <tr
              className={styles.taskListTableRow}
              style={{ height: rowHeight }}
              key={`${t.id}row`}
            >
              {listColumns.map(item => {
                let childNode: any;
                let cellProps;

                if (item.children) {
                  childNode = item.children;
                } else {
                  const value = getPathValue(t, item.dataIndex);
                  childNode = value;
                  if (item.render) {
                    const renderData = item.render(value, t, index);

                    if (isRenderCell(renderData)) {
                      childNode = renderData.children;
                      cellProps = renderData.props;
                    } else {
                      childNode = renderData;
                    }
                  }
                }

                if (
                  typeof childNode === "object" &&
                  !Array.isArray(childNode) &&
                  !React.isValidElement(childNode)
                ) {
                  childNode = null;
                }

                const { colSpan: cellColSpan, rowSpan: cellRowSpan } =
                  cellProps || {};
                const mergedColSpan =
                  cellColSpan !== undefined ? cellColSpan : item.colSpan;
                const mergedRowSpan =
                  cellRowSpan !== undefined ? cellRowSpan : item.rowSpan;

                if (mergedColSpan === 0 || mergedRowSpan === 0) {
                  return null;
                }

                let title;

                const ellipsisConfig =
                  item.ellipsis === true
                    ? {
                        showTitle: true,
                      }
                    : item.ellipsis;

                if (ellipsisConfig && ellipsisConfig.showTitle) {
                  if (
                    typeof childNode === "string" ||
                    typeof childNode === "number"
                  ) {
                    title = childNode.toString();
                  } else if (
                    React.isValidElement(childNode) &&
                    // @ts-ignore
                    typeof childNode.props.children === "string"
                  ) {
                    // @ts-ignore
                    title = childNode.props.children;
                  }
                }

                return (
                  <td
                    key={item.key || item.dataIndex}
                    className={classnames(
                      styles.taskListCell,
                      item.ellipsis ? styles.ellipsis : ""
                    )}
                    style={{
                      width: item.width || "auto",
                    }}
                    colSpan={
                      mergedColSpan && mergedColSpan !== 1
                        ? mergedColSpan
                        : null
                    }
                    rowSpan={
                      mergedRowSpan && mergedRowSpan !== 1
                        ? mergedRowSpan
                        : null
                    }
                  >
                    <div className={styles.taskListNameWrapper}>
                      <div
                        className={
                          expanderSymbol
                            ? styles.taskListExpander
                            : styles.taskListEmptyExpander
                        }
                        onClick={() => onExpanderClick(t)}
                      >
                        {expanderSymbol}
                      </div>
                      <div title={title} className={styles.ellipsis}>
                        {childNode}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
