import { Add, Search } from '@mui/icons-material';
import { IconButton, Card, CardContent, Grid, Button, Stack, Typography } from '@mui/material';
import { DeleteCategory, QueryCategory } from 'api/category.api';
import { CategoryTable, FilterCategory } from 'components/Category';
import { DeleteDialog } from 'components/CustomComponents/DeleteDialog';
import { SearchInput } from 'components/CustomComponents/SearchInput';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const CategoriesIndex = () => {
    const [datas, setDatas] = useState([]);
    const [filter, setFilter] = useState({ name: "", limit: 10, page: 0, sortBy: {} });
    const [tableFilter, setTableFilter] = useState({ totalPages: 0, totalResults: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [showSearch, setShowSearch] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [deleteObject, setDeleteObject] = useState({});
    const navigate = useNavigate();
    const { t } = useTranslation();

    const FetchData = () => {
        QueryCategory(filter)
            .then(res => {
                if (res.meta === 200) {
                    setDatas(res.results);
                    setFilter({ limit: res.limit, page: res.page, sortBy: filter.sortBy, name: filter.name });
                    setTableFilter({ totalPages: res.totalPages, totalResults: res.totalResults });
                    setIsLoading(false);
                }
            })
            .catch(err => {
                toast.error(err.message);
                setIsLoading(false);
                console.log(err);
            });
    };

    const handleEdit = (value) => {
        const state = {
            object: value,
            isEdit: true,
        }

        navigate("edit", { state });
    };

    const handleDelete = (value) => {
        setIsDelete(true);
        setDeleteObject(value);
    };

    const handleChangePage = (event, newPage) => {
        setFilter({ ...filter, page: newPage });
        setIsLoading(true);
    };

    const handleChangeRowsPerPage = (event) => {
        setFilter({ ...filter, page: 0, limit: parseInt(event.target.value, 10) });
        setIsLoading(true);
    };

    const handleFilterConfirm = (value) => {
        setFilter({ ...filter, sortBy: value });
    };

    const handleShowSearch = () => {
        setShowSearch(!showSearch);
    };

    const handleAddCategory = () => {
        const state = {
            object: {},
            isEdit: false,
        }

        navigate("edit", { state });
    };

    const handleSearch = (value) => {
        setFilter({ ...filter, name: value });
    };

    const handleDeleteConfirm = (value) => {
        DeleteCategory(value.id)
            .then(res => {
                if (res.meta === 200) {
                    setIsDelete(false);
                    FetchData();

                    return toast.success("Category deleted successfully");
                }
            })
            .catch(err => {
                setIsDelete(false);
                console.log(err);
                toast.error(err.message);
            })
    }

    useEffect(
        () => {
            setTimeout(() => {
                FetchData();
            }, 1000);

            return () => {
                setDatas([]);
                setIsLoading(true);
            }
        },
        [filter.page, filter.limit, filter.sortBy, filter.name]
    );

    return (
        <>
            <Card>
                <CardContent>
                    <Grid item container justifyContent="space-between" alignItems="center">
                        <Stack spacing={2}>
                            {showSearch ? <SearchInput title={"Search category name"} func={handleSearch} /> : <Typography variant="h6"> {t("categoryList")} </Typography>}
                        </Stack>

                        <Grid item>
                            <Stack spacing={2} direction="row">
                                <IconButton color={showSearch ? "secondary" : "default"} onClick={handleShowSearch}>
                                    <Search />
                                </IconButton>

                                <FilterCategory handleFilter={handleFilterConfirm} />

                                <Button variant="contained" startIcon={<Add />} onClick={handleAddCategory}> {t("addBtn")} </Button>
                            </Stack>
                        </Grid>
                    </Grid>

                    <CategoryTable
                        isLoading={isLoading}
                        filter={filter}
                        tableFilter={tableFilter}
                        datas={datas}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </CardContent>
            </Card>

            <DeleteDialog
                bodyText={`${t("confirmDeletePlaceholder")} ${deleteObject.name}`}
                isOpen={isDelete}
                onClose={() => setIsDelete(false)}
                onConfirm={handleDeleteConfirm}
                object={deleteObject}
            />
        </>
    )
}

export default CategoriesIndex