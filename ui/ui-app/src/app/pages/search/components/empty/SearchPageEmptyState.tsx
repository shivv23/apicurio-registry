import { FunctionComponent, useState } from "react";
import "./SearchPageEmptyState.css";
import {
    Button,
    EmptyState,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateVariant
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { If } from "@apicurio/common-ui-components";
import { SearchType } from "@app/pages/search/SearchType.ts";
import { CreateGroupModal } from "@app/components";
import { useGroupsService } from "@services/useGroupsService.ts";
import { CreateGroup } from "@sdk/lib/generated-client/models";

/**
 * Properties
 */
export type SearchPageEmptyStateProps = {
    searchType: SearchType;
    isFiltered: boolean;
};


/**
 * Models the empty state for the Search page (when there are no results).
 */
export const SearchPageEmptyState: FunctionComponent<SearchPageEmptyStateProps> = (props: SearchPageEmptyStateProps) => {
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const groups = useGroupsService();

    const doCreateGroup = (data: CreateGroup): void => {
        setIsCreateGroupModalOpen(false);
        groups.createGroup(data).then(() => {
            // Optionally, we could refresh the group list here, but the empty state will be re-evaluated
            // when the group list updates via the search results. For simplicity, we just close the modal.
        }).catch(error => {
            // TODO: handle error (maybe show an error message)
            console.error("Failed to create group:", error);
            // For now, we just close the modal and let the user try again.
            setIsCreateGroupModalOpen(false);
        });
    };

    const onCreateGroup = (): void => {
        setIsCreateGroupModalOpen(true);
    };

    let entitySingular: string;
    let entityPlural: string;
    switch (props.searchType) {
        case SearchType.ARTIFACT:
            entitySingular = "artifact";
            entityPlural = "artifacts";
            break;
        case SearchType.GROUP:
            entitySingular = "group";
            entityPlural = "groups";
            break;
        case SearchType.VERSION:
            entitySingular = "version";
            entityPlural = "versions";
            break;
    }
    return (
        <EmptyState titleText={`No ${entityPlural} found`} icon={PlusCircleIcon} variant={EmptyStateVariant.full}>
            <If condition={() => props.isFiltered}>
                <EmptyStateBody>
                    No {entityPlural} match your filter settings.  Change your filter or perhaps create a new {entitySingular}.
                </EmptyStateBody>
            </If>
            <If condition={() => !props.isFiltered}>
                <EmptyStateBody>
                    There are currently no {entityPlural} in the registry.  Create one or more {entityPlural} to view them here.
                </EmptyStateBody>
            </If>
            <EmptyStateFooter>
                {props.searchType === SearchType.GROUP && !props.isFiltered && (
                    <Button variant="primary" onClick={onCreateGroup}>
                        Create group
                    </Button>
                )}
            </EmptyStateFooter>
            <CreateGroupModal
                isOpen={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
                onCreate={doCreateGroup}
            />
        </EmptyState>
    );
};
