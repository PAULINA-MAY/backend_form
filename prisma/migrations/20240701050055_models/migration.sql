-- CreateTable
CREATE TABLE `User` (
    `Id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `FirstNames_user` VARCHAR(191) NOT NULL,
    `LastNames_user` VARCHAR(191) NOT NULL,
    `Email_user` VARCHAR(191) NOT NULL,
    `Password_user` VARCHAR(191) NOT NULL,
    `ImgProfile_user` VARCHAR(191) NOT NULL,
    `DateCreated_user` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `DateModified_user` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_Email_user_key`(`Email_user`),
    PRIMARY KEY (`Id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rol` (
    `Id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `Id_user_FK` INTEGER NOT NULL,
    `Name_rol` VARCHAR(191) NOT NULL DEFAULT 'user',

    PRIMARY KEY (`Id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Form` (
    `Id_f` INTEGER NOT NULL AUTO_INCREMENT,
    `FK_Id_user` INTEGER NOT NULL,
    `Title_f` VARCHAR(191) NOT NULL,
    `Desc_p` VARCHAR(191) NOT NULL,
    `DateCreate_f` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`Id_f`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `Id_q` INTEGER NOT NULL AUTO_INCREMENT,
    `FK_Id_f` INTEGER NOT NULL,
    `Content_q` VARCHAR(191) NOT NULL,
    `Value_q` INTEGER NOT NULL,
    `DateCreate_q` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`Id_q`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Option` (
    `Id_o` INTEGER NOT NULL AUTO_INCREMENT,
    `FK_Id_q` INTEGER NOT NULL,
    `Content_o` VARCHAR(191) NOT NULL,
    `IsCorrect` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`Id_o`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Answer` (
    `Id_a` INTEGER NOT NULL AUTO_INCREMENT,
    `FK_Id_q` INTEGER NOT NULL,
    `FK_Id_u` INTEGER NOT NULL,
    `FK_Id_o` INTEGER NOT NULL,
    `DateCreate_a` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`Id_a`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rol` ADD CONSTRAINT `Rol_Id_user_FK_fkey` FOREIGN KEY (`Id_user_FK`) REFERENCES `User`(`Id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Form` ADD CONSTRAINT `Form_FK_Id_user_fkey` FOREIGN KEY (`FK_Id_user`) REFERENCES `User`(`Id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_FK_Id_f_fkey` FOREIGN KEY (`FK_Id_f`) REFERENCES `Form`(`Id_f`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_FK_Id_q_fkey` FOREIGN KEY (`FK_Id_q`) REFERENCES `Question`(`Id_q`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_FK_Id_q_fkey` FOREIGN KEY (`FK_Id_q`) REFERENCES `Question`(`Id_q`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_FK_Id_u_fkey` FOREIGN KEY (`FK_Id_u`) REFERENCES `User`(`Id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_FK_Id_o_fkey` FOREIGN KEY (`FK_Id_o`) REFERENCES `Option`(`Id_o`) ON DELETE CASCADE ON UPDATE CASCADE;
