"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/common/Card";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { UnavailableState } from "@/components/common/UnavailableState";
import { UserTable } from "@/components/users/UserTable";
import { getUsers } from "@/lib/api";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function UsersPage() {
  const { data, loading, error, retry } = useAsyncData(getUsers);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (data?.users ?? []).filter((user) => {
      const text = `${user.id} ${user.displayName} ${user.deviceId}`.toLowerCase();
      return needle.length === 0 || text.includes(needle);
    });
  }, [data, query]);

  if (loading) return <LoadingState label="Loading observed devices" />;
  if (error || !data) return <ErrorState message={error ?? "Users unavailable"} onRetry={retry} />;

  if (!data.users.length) {
    return (
      <div>
        <PageHeader
          eyebrow="Directory"
          title="Users"
          description={data.message}
        />
        <UnavailableState
          title="User management data is not available yet."
          detail="The Android app does not register user accounts. Device identifiers will appear here after they are observed on emergency reports."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Observed devices"
        title="Users"
        description={data.message}
      />
      <Card className="mb-4 p-4">
        <SearchInput
          label="Search devices"
          placeholder="Search device ID or name"
          value={query}
          onChange={setQuery}
        />
      </Card>
      <Card>
        <UserTable rows={rows} />
      </Card>
    </div>
  );
}
