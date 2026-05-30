import { useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useCompanies } from '@/hooks/useCompanies';
import { useDeleteCompany } from '@/hooks/useCompanyMutations';
import { Loader } from '@/components/Loader';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

export function CompaniesPage() {
    const [page, setPage] = useState(0);
    const pageSize = 25;
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user } = useAuth();
    const deleteCompany = useDeleteCompany();

    const { data, isLoading, isError } = useCompanies({ page: page + 1, page_size: pageSize });

    if (isLoading) return <Loader />;
    if (isError) {
        showToast('Unable to load companies', 'error');
    }

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

    const handleDelete = async (companyId: number, companyName: string) => {
        if (!window.confirm(`Delete ${companyName}? This cannot be undone.`)) {
            return;
        }

        try {
            await deleteCompany.mutateAsync(companyId);
            showToast('Company deleted', 'success');
        } catch {
            showToast('Unable to delete company', 'error');
        }
    };

    const canDelete = user?.role === 'ADMIN';

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Companies</Typography>
                <Button variant="contained" onClick={() => navigate('/companies/new')}>Add Company</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Departments</TableCell>
                            <TableCell>Employees</TableCell>
                            {canDelete ? <TableCell>Actions</TableCell> : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.results.map((c) => (
                            <TableRow key={c.id} hover component={Link} to={`/companies/${c.id}`} style={{ textDecoration: 'none' }}>
                                <TableCell>{c.name}</TableCell>
                                <TableCell>{c.address}</TableCell>
                                <TableCell>{c.departments_count ?? 0}</TableCell>
                                <TableCell>{c.employees_count ?? 0}</TableCell>
                                {canDelete ? (
                                    <TableCell>
                                        <Button
                                            color="error"
                                            size="small"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                void handleDelete(c.id, c.name);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={data?.count ?? 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={pageSize}
                rowsPerPageOptions={[pageSize]}
            />
        </Box>
    );
}
