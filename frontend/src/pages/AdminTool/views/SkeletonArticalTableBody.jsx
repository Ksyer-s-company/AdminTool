import React from 'react';
import { TableBody, TableRow, TableCell } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { observer } from 'mobx-react';

const SkeletonArticleTableBody = observer(({ cols }) => (
  <TableBody>
    <TableRow>
      <TableCell colSpan={cols.length}>
        <Skeleton />
      </TableCell>
    </TableRow>
  </TableBody>
));

export default SkeletonArticleTableBody;
