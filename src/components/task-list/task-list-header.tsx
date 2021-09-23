import React from "react";
import { ListColumn } from "../../types/public-types";
import styles from "./task-list-header.module.css";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  listColumns: ListColumn[];
}> = ({ headerHeight, fontFamily, fontSize, listColumns, rowWidth }) => {
  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        width: rowWidth,
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight - 2,
        }}
      >
        {listColumns.map(item => (
          <div
            key={item.key || item.dataIndex}
            className={styles.ganttTable_HeaderItem}
            style={{
              width: item.width || "auto",
            }}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};
