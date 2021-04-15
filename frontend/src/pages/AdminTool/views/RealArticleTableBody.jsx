import React from 'react';
import { Link as MuiLink, TableBody, TableRow, TableCell, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';

import useStyles from '../useStyles';
import cellFormatter from '../../../utils/cellFormatter';
import HighlightTypogarphy from '../../StockApp/views/components/HighlightTypography';

const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    fontSize: theme.typography.fontSize,
    whiteSpace: 'pre-line',
  },
}))(Tooltip);

const RealArticleTableBody = observer(
  ({ data, cols, defaultFormatter, colFormatterMap, loading, keywords }) => {
    const classes = useStyles();
    return (
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.title}>
            {cols.map((colKey) => (
              <TableCell
                key={colKey}
                className={`${colKey === 'statements' ? classes.fixedCell80 : ''} ${
                  colKey === 'title' ? classes.fixedCell20 : ''
                } ${colKey === 'stock_statement' ? classes.hoverCell : ''} ${classes.textCell} ${
                  loading ? classes.loadingCell : ''
                }`}
              >
                {(() => {
                  switch (colKey) {
                    case 'title':
                      return (
                        <MuiLink href={row.url} target="_blank">
                          <div>
                            {cellFormatter(
                              row[colKey],
                              colFormatterMap[colKey] || defaultFormatter
                            )}
                          </div>
                        </MuiLink>
                      );
                    default:
                      return (
                        <HighlightTypogarphy keywords={keywords}>
                          {cellFormatter(row[colKey], colFormatterMap[colKey] || defaultFormatter)}
                        </HighlightTypogarphy>
                      );
                  }
                })()}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }
);

export default RealArticleTableBody;
