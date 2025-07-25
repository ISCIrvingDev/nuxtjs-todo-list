<template>
    <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="confirmModalTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header bg-light">
                    <h5 class="modal-title" id="confirmModalTitle">Confirm</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    Do you really want to delete this {{ item }}?
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-success" data-dismiss="modal" @click="done">Yes</button>
                    <button type="button" class="btn btn-outline-danger" data-dismiss="modal">No</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ConfirmModal',
        props: {
            item: String
        },
        methods: {
            done () {
                this.$emit('done');
            }
        }
    }
</script>

<style>
    /* x */
</style>