'use client';
import * as React from 'react';
import { useState, useMemo } from 'react';
import { InferSelectModel } from 'drizzle-orm';
import {
	forms,
	answers,
	formSubmissions,
	questions,
	fieldOptions,
} from '@/db/schema';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	PaginationState,
} from '@tanstack/react-table';

type FieldOption = InferSelectModel<typeof fieldOptions>;

type Answer = InferSelectModel<typeof answers> & {
	fieldOption?: FieldOption | null;
};

type Question = InferSelectModel<typeof questions> & {
	fieldOptions: FieldOption[];
};

type FormSubmission = InferSelectModel<typeof formSubmissions> & {
	answers: Answer[];
};

export type Form =
	| (InferSelectModel<typeof forms> & {
			questions: Question[];
			submissions: FormSubmission[];
	  })
	| undefined;

interface TableProps {
	data: FormSubmission[];
	columns: Question[];
}

const columnHelper = createColumnHelper<any>();

export function Table({ data, columns }: TableProps) {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const [search, setSearch] = useState('');

	const filteredData = useMemo(
		() =>
			data.filter((submission) =>
				submission.answers.some((answer) =>
					answer.value?.toLowerCase().includes(search.toLowerCase())
				)
			),
		[data, search]
	);

	const tableColumns = useMemo(
		() => [
			columnHelper.accessor('id', {
				cell: (info) => info.getValue(),
				header: 'ID',
			}),
			...columns.map((question) => {
				return columnHelper.accessor(
					(row) => {
						const answer = row.answers.find(
							(a: { questionId: number }) => a.questionId === question.id
						);
						return answer?.fieldOption
							? answer.fieldOption.text
							: answer?.value ?? '';
					},
					{
						header: () => question.text,
						id: question.id.toString(),
						cell: (info) => info.renderValue(),
					}
				);
			}),
			columnHelper.accessor('actions', {
				header: 'Actions',
				cell: () => (
					<div>
						<button className='text-blue-500 hover:underline'>Edit</button>
						<button className='text-red-500 hover:underline ml-2'>
							Delete
						</button>
					</div>
				),
			}),
		],
		[columns]
	);

	const table = useReactTable({
		data: filteredData,
		columns: tableColumns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: { pagination },
		onPaginationChange: setPagination,
		pageCount: Math.ceil(filteredData.length / pagination.pageSize),
		manualPagination: true,
		initialState: {
			sorting: [
				{
					id: 'id',
					desc: false,
				},
			],
		},
	});

	const handleClearSearch = () => setSearch('');

	const handleSelectAll = () => {
		const allSelected =
			table.getSelectedRowModel().rows.length ===
			table.getRowModel().rows.length;
		table.getRowModel().rows.forEach((row) => row.toggleSelected(!allSelected));
	};

	return (
		<div className='p-4 mt-4 bg-white shadow-md rounded-lg'>
			<div className='flex mb-4'>
				<input
					type='text'
					placeholder='Search...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className='p-2 border rounded-md w-full'
					aria-label='Search submissions'
				/>
				<button
					onClick={handleClearSearch}
					className='ml-2 p-2 border rounded-md'
					aria-label='Clear search'
				>
					Clear
				</button>
			</div>
			<div className='overflow-auto rounded-lg'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50 sticky top-0 z-10'>
						<tr>
							<th className='p-3'>
								<input type='checkbox' onChange={handleSelectAll} />
							</th>
							{table.getHeaderGroups().map((headerGroup) =>
								headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className={`text-left p-3 cursor-pointer bg-gray-100 font-semibold ${
											header.column.getIsSorted() ? 'bg-blue-100' : ''
										}`}
										onClick={header.column.getToggleSortingHandler()}
										aria-sort={
											header.column.getIsSorted()
												? header.column.getIsSorted() === 'desc'
													? 'descending'
													: 'ascending'
												: 'none'
										}
										title={
											header.column.columnDef.header
												? String(header.column.columnDef.header)
												: ''
										}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
										{header.column.getIsSorted()
											? header.column.getIsSorted() === 'desc'
												? ' 🔽'
												: ' 🔼'
											: ''}
									</th>
								))
							)}
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200'>
						{table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								className={`hover:bg-gray-100 focus:bg-gray-200 ${
									row.index % 2 === 0 ? 'bg-white' : '#f9fafb'
								}`}
								tabIndex={0}
								style={{
									backgroundColor: row.getIsSelected() ? '#cce5ff' : '',
								}}
								onClick={() => row.toggleSelected()}
								role='row'
								aria-selected={row.getIsSelected()}
							>
								<td className='p-3'>
									<input
										type='checkbox'
										checked={row.getIsSelected()}
										onChange={() => row.toggleSelected()}
									/>
								</td>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className='p-3'>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className='flex justify-between items-center mt-4'>
				<div className='flex items-center'>
					<button
						className='p-2 border rounded-md'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</button>
					<span className='mx-2'>
						Page{' '}
						<input
							type='number'
							value={table.getState().pagination.pageIndex + 1}
							onChange={(e) => table.setPageIndex(Number(e.target.value) - 1)}
							className='border rounded-md w-12 text-center'
						/>{' '}
						of {table.getPageCount()}
					</span>
					<button
						className='p-2 border rounded-md'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</button>
				</div>
				<select
					className='p-2 border rounded-md'
					value={table.getState().pagination.pageSize}
					onChange={(e) => table.setPageSize(Number(e.target.value))}
				>
					{['10', '20', '30', '40', '50'].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
