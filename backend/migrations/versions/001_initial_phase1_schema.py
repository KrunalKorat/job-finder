"""initial_phase1_schema

Revision ID: 001_initial
Revises: 
Create Date: 2026-10-26 14:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default=sa.text('0')),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='active'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # 2. user_profiles
    op.create_table(
        'user_profiles',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=True),
        sa.Column('professional_headline', sa.String(length=255), nullable=True),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('portfolio_url', sa.String(length=512), nullable=True),
        sa.Column('linkedin_url', sa.String(length=512), nullable=True),
        sa.Column('profile_completion_status', sa.String(length=50), nullable=False, server_default='incomplete'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    )
    op.create_index(op.f('ix_user_profiles_user_id'), 'user_profiles', ['user_id'], unique=True)

    # 3. career_preferences
    op.create_table(
        'career_preferences',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('desired_job_titles', sa.JSON(), nullable=False),
        sa.Column('skills', sa.JSON(), nullable=False),
        sa.Column('preferred_locations', sa.JSON(), nullable=False),
        sa.Column('work_arrangements', sa.JSON(), nullable=False),
        sa.Column('employment_types', sa.JSON(), nullable=False),
        sa.Column('min_salary', sa.Integer(), nullable=True),
        sa.Column('salary_currency', sa.String(length=10), nullable=False, server_default='USD'),
        sa.Column('preferred_industries', sa.JSON(), nullable=False),
        sa.Column('work_authorization_status', sa.String(length=100), nullable=False, server_default='authorized'),
        sa.Column('sponsorship_required', sa.Boolean(), nullable=False, server_default=sa.text('0')),
        sa.Column('excluded_employers', sa.JSON(), nullable=False),
        sa.Column('matching_threshold', sa.Integer(), nullable=False, server_default='75'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    )
    op.create_index(op.f('ix_career_preferences_user_id'), 'career_preferences', ['user_id'], unique=True)

    # 4. resumes
    op.create_table(
        'resumes',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('storage_key', sa.String(length=512), nullable=False),
        sa.Column('original_filename', sa.String(length=255), nullable=False),
        sa.Column('mime_type', sa.String(length=100), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=False),
        sa.Column('upload_status', sa.String(length=50), nullable=False, server_default='completed'),
        sa.Column('processing_status', sa.String(length=50), nullable=False, server_default='unprocessed'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    )
    op.create_index(op.f('ix_resumes_user_id'), 'resumes', ['user_id'], unique=False)

    # 5. automation_settings
    op.create_table(
        'automation_settings',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('automation_enabled', sa.Boolean(), nullable=False, server_default=sa.text('0')),
        sa.Column('automation_mode', sa.String(length=50), nullable=False, server_default='manual_review'),
        sa.Column('min_match_score', sa.Integer(), nullable=False, server_default='80'),
        sa.Column('max_applications_per_day', sa.Integer(), nullable=False, server_default='5'),
        sa.Column('max_applications_per_week', sa.Integer(), nullable=False, server_default='20'),
        sa.Column('approved_providers', sa.JSON(), nullable=False),
        sa.Column('excluded_employers', sa.JSON(), nullable=False),
        sa.Column('require_approval', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    )
    op.create_index(op.f('ix_automation_settings_user_id'), 'automation_settings', ['user_id'], unique=True)

    # 6. job_source_registry
    op.create_table(
        'job_source_registry',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('provider_id', sa.String(length=50), nullable=False),
        sa.Column('provider_name', sa.String(length=100), nullable=False),
        sa.Column('base_url_or_ref', sa.String(length=512), nullable=False),
        sa.Column('integration_type', sa.String(length=50), nullable=False),
        sa.Column('can_discover_jobs', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('can_submit_applications', sa.Boolean(), nullable=False, server_default=sa.text('0')),
        sa.Column('authorization_status', sa.String(length=50), nullable=False, server_default='authorized_public_read'),
        sa.Column('is_enabled', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('last_sync_status', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_job_source_registry_provider_id'), 'job_source_registry', ['provider_id'], unique=True)


def downgrade() -> None:
    op.drop_table('job_source_registry')
    op.drop_table('automation_settings')
    op.drop_table('resumes')
    op.drop_table('career_preferences')
    op.drop_table('user_profiles')
    op.drop_table('users')
