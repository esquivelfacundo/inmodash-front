BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] VARCHAR(255) NOT NULL,
    [passwordHash] VARCHAR(255) NOT NULL,
    [name] VARCHAR(255) NOT NULL,
    [role] VARCHAR(50) NOT NULL CONSTRAINT [users_role_df] DEFAULT 'user',
    [isEmailVerified] BIT NOT NULL CONSTRAINT [users_isEmailVerified_df] DEFAULT 0,
    [emailVerificationToken] VARCHAR(255),
    [emailVerificationExpires] DATETIME2,
    [passwordResetToken] VARCHAR(255),
    [passwordResetExpires] DATETIME2,
    [refreshTokenHash] VARCHAR(255),
    [failedLoginAttempts] INT NOT NULL CONSTRAINT [users_failedLoginAttempts_df] DEFAULT 0,
    [lockedUntil] DATETIME2,
    [lastLoginAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [phone] VARCHAR(50),
    [position] VARCHAR(100),
    [companyName] VARCHAR(255),
    [companyTaxId] VARCHAR(100),
    [companyAddress] VARCHAR(500),
    [companyCity] VARCHAR(100),
    [companyState] VARCHAR(100),
    [companyCountry] VARCHAR(100),
    [companyZipCode] VARCHAR(20),
    [companyPhone] VARCHAR(50),
    [companyWebsite] VARCHAR(255),
    [subscriptionStatus] VARCHAR(50) NOT NULL CONSTRAINT [users_subscriptionStatus_df] DEFAULT 'trial',
    [subscriptionPlan] VARCHAR(50) NOT NULL CONSTRAINT [users_subscriptionPlan_df] DEFAULT 'professional',
    [subscriptionStartDate] DATETIME2,
    [subscriptionEndDate] DATETIME2,
    [trialEndsAt] DATETIME2,
    [paymentMethod] VARCHAR(50),
    [lastPaymentDate] DATETIME2,
    [nextPaymentDate] DATETIME2,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[sessions] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] INT NOT NULL,
    [sessionToken] VARCHAR(255) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [sessions_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [sessions_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [sessions_sessionToken_key] UNIQUE NONCLUSTERED ([sessionToken])
);

-- CreateTable
CREATE TABLE [dbo].[audit_logs] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT,
    [action] VARCHAR(100) NOT NULL,
    [resource] VARCHAR(100) NOT NULL,
    [resourceId] VARCHAR(50),
    [details] TEXT,
    [ipAddress] VARCHAR(45),
    [userAgent] VARCHAR(500),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [audit_logs_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [audit_logs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[buildings] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [name] VARCHAR(255) NOT NULL,
    [address] VARCHAR(500) NOT NULL,
    [city] VARCHAR(100) NOT NULL,
    [province] VARCHAR(100) NOT NULL,
    [owner] VARCHAR(255) NOT NULL,
    [floors] INT NOT NULL,
    [totalArea] FLOAT(53) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [buildings_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [buildings_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[floor_configurations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [buildingId] INT NOT NULL,
    [floor] INT NOT NULL,
    [apartmentsCount] INT NOT NULL,
    CONSTRAINT [floor_configurations_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[owners] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [name] VARCHAR(255) NOT NULL,
    [dniOrCuit] VARCHAR(20) NOT NULL,
    [phone] VARCHAR(50) NOT NULL,
    [email] VARCHAR(255) NOT NULL,
    [address] VARCHAR(500) NOT NULL,
    [bankAccount] VARCHAR(100),
    [commissionPercentage] FLOAT(53) NOT NULL CONSTRAINT [owners_commissionPercentage_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [owners_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [owners_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [owners_dniOrCuit_key] UNIQUE NONCLUSTERED ([dniOrCuit])
);

-- CreateTable
CREATE TABLE [dbo].[apartments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [uniqueId] VARCHAR(50) NOT NULL,
    [buildingId] INT,
    [floor] INT,
    [apartmentLetter] VARCHAR(5),
    [nomenclature] VARCHAR(10) NOT NULL,
    [fullAddress] VARCHAR(500),
    [city] VARCHAR(100),
    [province] VARCHAR(100),
    [ownerId] INT,
    [propertyType] VARCHAR(50) NOT NULL CONSTRAINT [apartments_propertyType_df] DEFAULT 'departamento',
    [area] FLOAT(53) NOT NULL CONSTRAINT [apartments_area_df] DEFAULT 0,
    [rooms] INT NOT NULL CONSTRAINT [apartments_rooms_df] DEFAULT 0,
    [areaPercentage] FLOAT(53) NOT NULL CONSTRAINT [apartments_areaPercentage_df] DEFAULT 0,
    [roomPercentage] FLOAT(53) NOT NULL CONSTRAINT [apartments_roomPercentage_df] DEFAULT 0,
    [status] VARCHAR(50) NOT NULL CONSTRAINT [apartments_status_df] DEFAULT 'disponible',
    [saleStatus] VARCHAR(50) NOT NULL CONSTRAINT [apartments_saleStatus_df] DEFAULT 'no_esta_en_venta',
    [specifications] NVARCHAR(max),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [apartments_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [apartments_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [apartments_uniqueId_key] UNIQUE NONCLUSTERED ([uniqueId])
);

-- CreateTable
CREATE TABLE [dbo].[tenants] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [nameOrBusiness] VARCHAR(255) NOT NULL,
    [dniOrCuit] VARCHAR(20) NOT NULL,
    [address] VARCHAR(500) NOT NULL,
    [contactName] VARCHAR(255) NOT NULL,
    [contactPhone] VARCHAR(50) NOT NULL,
    [contactEmail] VARCHAR(255) NOT NULL,
    [contactAddress] VARCHAR(500) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [tenants_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [tenants_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[guarantors] (
    [id] INT NOT NULL IDENTITY(1,1),
    [tenantId] INT NOT NULL,
    [name] VARCHAR(255) NOT NULL,
    [dni] VARCHAR(20) NOT NULL,
    [address] VARCHAR(500) NOT NULL,
    [email] VARCHAR(255) NOT NULL,
    [phone] VARCHAR(50) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [guarantors_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [guarantors_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[contracts] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [apartmentId] INT NOT NULL,
    [tenantId] INT NOT NULL,
    [startDate] DATETIME2 NOT NULL,
    [endDate] DATETIME2 NOT NULL,
    [initialAmount] FLOAT(53) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [contracts_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [contracts_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[update_rules] (
    [id] INT NOT NULL IDENTITY(1,1),
    [contractId] INT NOT NULL,
    [updateFrequency] VARCHAR(50) NOT NULL,
    [monthlyCoefficient] FLOAT(53),
    [lateInterestPercent] FLOAT(53),
    [lateInterestFrequency] VARCHAR(50),
    CONSTRAINT [update_rules_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [update_rules_contractId_key] UNIQUE NONCLUSTERED ([contractId])
);

-- CreateTable
CREATE TABLE [dbo].[update_periods] (
    [id] INT NOT NULL IDENTITY(1,1),
    [updateRuleId] INT NOT NULL,
    [date] DATETIME2 NOT NULL,
    [type] VARCHAR(50) NOT NULL,
    [value] FLOAT(53),
    [indexName] VARCHAR(100),
    CONSTRAINT [update_periods_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[payments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [contractId] INT NOT NULL,
    [month] DATETIME2 NOT NULL,
    [amount] FLOAT(53) NOT NULL,
    [commissionAmount] FLOAT(53) NOT NULL CONSTRAINT [payments_commissionAmount_df] DEFAULT 0,
    [ownerAmount] FLOAT(53) NOT NULL CONSTRAINT [payments_ownerAmount_df] DEFAULT 0,
    [paymentDate] DATETIME2,
    [status] VARCHAR(20) NOT NULL CONSTRAINT [payments_status_df] DEFAULT 'pending',
    [notes] VARCHAR(500),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [payments_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [payments_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[documents] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [type] VARCHAR(50) NOT NULL,
    [fileName] VARCHAR(255) NOT NULL,
    [fileUrl] VARCHAR(500) NOT NULL,
    [fileSize] INT NOT NULL,
    [mimeType] VARCHAR(100) NOT NULL,
    [description] VARCHAR(500),
    [uploadedAt] DATETIME2 NOT NULL CONSTRAINT [documents_uploadedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [tenantId] INT,
    [ownerId] INT,
    [contractId] INT,
    [apartmentId] INT,
    CONSTRAINT [documents_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[contract_guarantors] (
    [contractId] INT NOT NULL,
    [guarantorId] INT NOT NULL,
    CONSTRAINT [contract_guarantors_pkey] PRIMARY KEY CLUSTERED ([contractId],[guarantorId])
);

-- CreateTable
CREATE TABLE [dbo].[rental_history] (
    [id] INT NOT NULL IDENTITY(1,1),
    [apartmentId] INT NOT NULL,
    [contractId] INT NOT NULL,
    [tenantId] INT NOT NULL,
    [tenantName] VARCHAR(255) NOT NULL,
    [startDate] DATETIME2 NOT NULL,
    [endDate] DATETIME2 NOT NULL,
    [initialAmount] FLOAT(53) NOT NULL,
    [finalAmount] FLOAT(53),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [rental_history_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [rental_history_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [rental_history_contractId_key] UNIQUE NONCLUSTERED ([contractId])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [users_email_idx] ON [dbo].[users]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [users_role_idx] ON [dbo].[users]([role]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [sessions_userId_idx] ON [dbo].[sessions]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [sessions_sessionToken_idx] ON [dbo].[sessions]([sessionToken]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_logs_userId_idx] ON [dbo].[audit_logs]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_logs_action_idx] ON [dbo].[audit_logs]([action]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_logs_createdAt_idx] ON [dbo].[audit_logs]([createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [buildings_userId_idx] ON [dbo].[buildings]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [buildings_name_idx] ON [dbo].[buildings]([name]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [floor_configurations_buildingId_idx] ON [dbo].[floor_configurations]([buildingId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [owners_userId_idx] ON [dbo].[owners]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [owners_dniOrCuit_idx] ON [dbo].[owners]([dniOrCuit]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [apartments_buildingId_idx] ON [dbo].[apartments]([buildingId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [apartments_ownerId_idx] ON [dbo].[apartments]([ownerId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [apartments_status_idx] ON [dbo].[apartments]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [tenants_userId_idx] ON [dbo].[tenants]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [tenants_dniOrCuit_idx] ON [dbo].[tenants]([dniOrCuit]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [guarantors_tenantId_idx] ON [dbo].[guarantors]([tenantId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [contracts_userId_idx] ON [dbo].[contracts]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [contracts_apartmentId_idx] ON [dbo].[contracts]([apartmentId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [contracts_tenantId_idx] ON [dbo].[contracts]([tenantId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [update_periods_updateRuleId_idx] ON [dbo].[update_periods]([updateRuleId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [payments_userId_idx] ON [dbo].[payments]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [payments_contractId_idx] ON [dbo].[payments]([contractId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [payments_status_idx] ON [dbo].[payments]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [payments_month_idx] ON [dbo].[payments]([month]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [documents_userId_idx] ON [dbo].[documents]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [documents_tenantId_idx] ON [dbo].[documents]([tenantId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [documents_ownerId_idx] ON [dbo].[documents]([ownerId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [documents_contractId_idx] ON [dbo].[documents]([contractId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [documents_apartmentId_idx] ON [dbo].[documents]([apartmentId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [documents_type_idx] ON [dbo].[documents]([type]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [rental_history_apartmentId_idx] ON [dbo].[rental_history]([apartmentId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [rental_history_tenantId_idx] ON [dbo].[rental_history]([tenantId]);

-- AddForeignKey
ALTER TABLE [dbo].[sessions] ADD CONSTRAINT [sessions_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[audit_logs] ADD CONSTRAINT [audit_logs_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[buildings] ADD CONSTRAINT [buildings_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[floor_configurations] ADD CONSTRAINT [floor_configurations_buildingId_fkey] FOREIGN KEY ([buildingId]) REFERENCES [dbo].[buildings]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[owners] ADD CONSTRAINT [owners_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[apartments] ADD CONSTRAINT [apartments_buildingId_fkey] FOREIGN KEY ([buildingId]) REFERENCES [dbo].[buildings]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[apartments] ADD CONSTRAINT [apartments_ownerId_fkey] FOREIGN KEY ([ownerId]) REFERENCES [dbo].[owners]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[tenants] ADD CONSTRAINT [tenants_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[guarantors] ADD CONSTRAINT [guarantors_tenantId_fkey] FOREIGN KEY ([tenantId]) REFERENCES [dbo].[tenants]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[contracts] ADD CONSTRAINT [contracts_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[contracts] ADD CONSTRAINT [contracts_apartmentId_fkey] FOREIGN KEY ([apartmentId]) REFERENCES [dbo].[apartments]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[contracts] ADD CONSTRAINT [contracts_tenantId_fkey] FOREIGN KEY ([tenantId]) REFERENCES [dbo].[tenants]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[update_rules] ADD CONSTRAINT [update_rules_contractId_fkey] FOREIGN KEY ([contractId]) REFERENCES [dbo].[contracts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[update_periods] ADD CONSTRAINT [update_periods_updateRuleId_fkey] FOREIGN KEY ([updateRuleId]) REFERENCES [dbo].[update_rules]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[payments] ADD CONSTRAINT [payments_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[payments] ADD CONSTRAINT [payments_contractId_fkey] FOREIGN KEY ([contractId]) REFERENCES [dbo].[contracts]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[documents] ADD CONSTRAINT [documents_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[documents] ADD CONSTRAINT [documents_tenantId_fkey] FOREIGN KEY ([tenantId]) REFERENCES [dbo].[tenants]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[documents] ADD CONSTRAINT [documents_ownerId_fkey] FOREIGN KEY ([ownerId]) REFERENCES [dbo].[owners]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[documents] ADD CONSTRAINT [documents_contractId_fkey] FOREIGN KEY ([contractId]) REFERENCES [dbo].[contracts]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[documents] ADD CONSTRAINT [documents_apartmentId_fkey] FOREIGN KEY ([apartmentId]) REFERENCES [dbo].[apartments]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[contract_guarantors] ADD CONSTRAINT [contract_guarantors_contractId_fkey] FOREIGN KEY ([contractId]) REFERENCES [dbo].[contracts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[contract_guarantors] ADD CONSTRAINT [contract_guarantors_guarantorId_fkey] FOREIGN KEY ([guarantorId]) REFERENCES [dbo].[guarantors]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[rental_history] ADD CONSTRAINT [rental_history_apartmentId_fkey] FOREIGN KEY ([apartmentId]) REFERENCES [dbo].[apartments]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[rental_history] ADD CONSTRAINT [rental_history_contractId_fkey] FOREIGN KEY ([contractId]) REFERENCES [dbo].[contracts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[rental_history] ADD CONSTRAINT [rental_history_tenantId_fkey] FOREIGN KEY ([tenantId]) REFERENCES [dbo].[tenants]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
