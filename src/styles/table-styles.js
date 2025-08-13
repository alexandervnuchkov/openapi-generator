import { css } from 'lit';

export default css`
.m-table {
  border-spacing: 0;
  border-collapse: separate;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  margin: 0;
  max-width: 100%;
  direction: ltr;
}
.m-table tr:first-child td,
.m-table tr:first-child th {
    border-top: 0 none;
}
.m-table td,
.m-table th {
  font-size: var(--font-size-regular);
  line-height: calc(var(--font-size-regular) + 6px);
  padding: 10px;
  vertical-align: top;
  border-bottom: 1px solid var(--light-gray);
}
.m-table td:first-child,
.m-table th:first-child {
  padding-left: 32px;
}
.m-table tr:last-of-type td {
  border-bottom: 0 none;
}
.m-table.padded-12 td,
.m-table.padded-12 th {
  padding: 12px;
}
.allow-try-first {
  border-radius: var(--border-radius) 0 0 0;
}
.allow-try-last {
  border-radius: 0 var(--border-radius) 0 0;
}
.deny-try-first {
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}
.deny-try-last {
  display: none;
}
.m-table td:not([align]),
.m-table th:not([align]) {
  text-align: left;
}
.m-table th {
  color: var(--gray);
  font-weight: 400;
  letter-spacing: normal;
  background-color: var(--lightest-gray);
  vertical-align: bottom;
}
.m-table > tbody > tr td,
.m-table > tr td {
  text-overflow: ellipsis;
  overflow: hidden;
}
.table-title {
  vertical-align: middle;
  margin: 12px 0 4px 0;
}
.expanded-req-resp-container {
  clear: both;
  padding-top: 30px;
}
`;
