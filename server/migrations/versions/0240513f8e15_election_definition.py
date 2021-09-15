# pylint: disable=invalid-name
"""Election Definition
Revision ID: 0240513f8e15
Revises: 805383ee14b9
Create Date: 2021-09-13 09:18:40.814886+00:00
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0240513f8e15'
down_revision = '805383ee14b9'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "district",
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("id", sa.String(length=200), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("definitons_file_id", sa.String(length=200), nullable=False),
        sa.Column("election_id", sa.String(length=200), nullable=False),
        sa.ForeignKeyConstraint(
            ["election_id"],
            ["election.id"],
            name=op.f("district_election_id_fkey"),
            ondelete="cascade",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("district_pkey")),
        sa.UniqueConstraint(
            "name", "election_id", name=op.f("district_election_id_name_key")
        ),
    )
    op.create_table(
        "precinct",
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("id", sa.String(length=200), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("definitons_file_id", sa.String(length=200), nullable=False),
        sa.Column("election_id", sa.String(length=200), nullable=False),
        sa.ForeignKeyConstraint(
            ["election_id"],
            ["election.id"],
            name=op.f("precinct_election_id_fkey"),
            ondelete="cascade",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("precinct_pkey")),
        sa.UniqueConstraint(
            "name", "election_id", name=op.f("precinct_election_id_name_key")
        ),
    )
    op.create_table(
        "party",
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("id", sa.String(length=200), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("definitons_file_id", sa.String(length=200), nullable=False),
        sa.Column("election_id", sa.String(length=200), nullable=False),
        sa.ForeignKeyConstraint(
            ["election_id"],
            ["election.id"],
            name=op.f("party_election_id_fkey"),
            ondelete="cascade",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("party_pkey")),
        sa.UniqueConstraint(
            "name", "election_id", name=op.f("party_election_id_name_key")
        ),
    )
    op.create_table(
        "contest",
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("id", sa.String(length=200), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("type", sa.String(length=200), nullable=False),
        sa.Column("seats", sa.String(length=200), nullable=False),
        sa.Column("allow_write_ins", sa.Boolean(), nullable=False),
        sa.Column("write_in_votes", sa.Integer(), nullable=False),
        sa.Column("definitons_file_id", sa.String(length=200), nullable=False),
        sa.Column("district_id", sa.String(length=200), nullable=False),
        sa.ForeignKeyConstraint(
            ["district_id"],
            ["district.id"],
            name=op.f("contest_district_id_fkey"),
            ondelete="cascade",
        ),
        sa.Column("election_id", sa.String(length=200), nullable=False),
        sa.ForeignKeyConstraint(
            ["election_id"],
            ["election.id"],
            name=op.f("contest_election_id_fkey"),
            ondelete="cascade",
        ),
        sa.Column("election_results_id", sa.String(length=200), nullable=False),
        sa.ForeignKeyConstraint(
            ["election_results_id"],
            ["election_results.id"],
            name=op.f("contest_election_results_id_fkey"),
            ondelete="cascade",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("contest_pkey")),
        sa.UniqueConstraint(
            "name", "district_id", "election_id", name=op.f("contest_district_id_election_id_name_key")
        ),
    )
    op.create_table(
        "candidate",
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("id", sa.String(length=200), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("num_votes", sa.Integer(), nullable=False),
        sa.Column("definitons_file_id", sa.String(length=200), nullable=False),
        sa.Column("party_id", sa.String(length=200), nullable=False),
        sa.ForeignKeyConstraint(
            ["party_id"],
            ["party.id"],
            name=op.f("candidate_party_id_fkey"),
            ondelete="cascade",
        ),
        sa.Column("contest_id", sa.String(length=200), nullable=False),
        sa.ForeignKeyConstraint(
            ["contest_id"],
            ["contest.id"],
            name=op.f("candidate_contest_id_fkey"),
            ondelete="cascade",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("candidate_pkey")),
        sa.UniqueConstraint(
            "name", "party_id", "contest_id",  name=op.f("candidate_party_id_contest_id_name_key")
        ),
    )


def downgrade():
    pass  # pragma: no cover
    # ### commands auto generated by Alembic - please adjust! ###
    # op.drop_table("candidate")
    # op.drop_table("contest")
    # op.drop_table("party")
    # op.drop_table("precinct")
    # op.drop_table("district")
    # ### end Alembic commands ###
