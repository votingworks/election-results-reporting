# pylint: disable=invalid-name
"""Activity log
Revision ID: 453143f2c7a9
Revises: cedd9b8f2043
Create Date: 2021-10-05 11:09:35.732278+00:00
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '453143f2c7a9'
down_revision = 'cedd9b8f2043'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('activity_log_record',
        sa.Column('id', sa.String(length=200), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('organization_id', sa.String(length=200), nullable=False),
        sa.Column('activity_name', sa.String(length=200), nullable=False),
        sa.Column('info', sa.JSON(), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organization.id'], name=op.f('activity_log_record_organization_id_fkey'), ondelete='cascade'),
        sa.PrimaryKeyConstraint('id', name=op.f('activity_log_record_pkey'))
    )
    # ### end Alembic commands ###


def downgrade():
    pass
    # ### commands auto generated by Alembic - please adjust! ###
    # op.drop_table('activity_log_record')
    # ### end Alembic commands ###