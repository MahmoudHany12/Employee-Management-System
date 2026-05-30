import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useEmployee, useMyEmployee } from '@/hooks/useEmployees';
import { useCompanies } from '@/hooks/useCompanies';
import { useDepartments } from '@/hooks/useDepartments';
import { Loader } from '@/components/Loader';

export function EmployeeProfilePage() {
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const id = params.id ? Number(params.id) : undefined;

    const { data: employee, isLoading } = useEmployee(id);
    const myEmployee = useMyEmployee();
    const companiesResp = useCompanies({ page: 1, page_size: 200 });
    const departmentsResp = useDepartments({ page: 1, page_size: 500 });

    const resolvedEmployee = employee ?? myEmployee.data ?? undefined;

    const companyName = useMemo(() => companiesResp.data?.results.find((item) => item.id === resolvedEmployee?.company_id)?.name ?? '', [companiesResp.data, resolvedEmployee?.company_id]);
    const departmentName = useMemo(() => departmentsResp.data?.results.find((item) => item.id === resolvedEmployee?.department_id)?.name ?? '', [departmentsResp.data, resolvedEmployee?.department_id]);

    if (isLoading || myEmployee.isLoading) return <Loader />;
    if (!resolvedEmployee) return <Typography>Profile not found.</Typography>;

    const isOwnProfile = user?.id === resolvedEmployee.user_id;
    const canEdit = Boolean(user && (user.role === 'ADMIN' || user.role === 'HR_MANAGER' || isOwnProfile));

    return (
        <Box>
            <Stack spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Typography variant="h4">Profile</Typography>
                        <Typography color="text.secondary">Employee details and account summary.</Typography>
                    </div>
                </Box>
            </Stack>

            <Paper sx={{ p: 3 }}>
                <Stack spacing={2}>
                    <Typography variant="h6">{user?.username ?? resolvedEmployee.email}</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip label={resolvedEmployee.is_active ? 'Active' : 'Inactive'} color={resolvedEmployee.is_active ? 'success' : 'default'} />
                        {resolvedEmployee.title ? <Chip label={resolvedEmployee.title} /> : null}
                    </Stack>
                    <Typography>Mobile: {resolvedEmployee.mobile ?? 'N/A'}</Typography>
                    <Typography>Company: {companyName || resolvedEmployee.company_id}</Typography>
                    <Typography>Department: {departmentName || 'N/A'}</Typography>
                    <Typography>Hire date: {resolvedEmployee.hire_date ?? 'N/A'}</Typography>
                    <Typography>Days employed: {resolvedEmployee.days_employed ?? 0}</Typography>
                    <Typography>Email: {resolvedEmployee.email}</Typography>
                    <Typography>Address: {resolvedEmployee.address ?? 'N/A'}</Typography>
                    {canEdit && resolvedEmployee.id ? <Button variant="contained" onClick={() => navigate(`/employees/${resolvedEmployee.id}/edit`)}>Edit</Button> : null}
                </Stack>
            </Paper>
        </Box>
    );
}
