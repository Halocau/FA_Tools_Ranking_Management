USE [RankingManagement]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Account](
	[account_id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](100) NOT NULL,
	[password_hash] [varchar](255) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[role_id] [int] NOT NULL,
	[status] [nvarchar](50) NULL,
	[full_name] [nvarchar](100) NULL,
	[date_of_birth] [date] NULL,
	[address] [nvarchar](255) NULL,
	[phone_number] [nvarchar](50) NULL,
	[gender] [nvarchar](50) NULL,
	[token] [varchar](255) NULL,
	[token_expiration] [datetime] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
 CONSTRAINT [PK__Account__46A222CD7F2ACED2] PRIMARY KEY CLUSTERED 
(
	[account_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Bulk_Ranking_History]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Bulk_Ranking_History](
	[history_id] [int] IDENTITY(1,1) NOT NULL,
	[file_name] [nvarchar](100) NULL,
	[file_path] [varchar](max) NULL,
	[ranking_group_id] [int] NULL,
	[upload_at] [datetime] NULL,
	[upload_by] [int] NULL,
	[status] [nvarchar](50) NULL,
	[note] [nvarchar](max) NULL,
 CONSTRAINT [PK__Bulk_Ran__096AA2E9D347236B] PRIMARY KEY CLUSTERED 
(
	[history_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Criteria]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Criteria](
	[criteria_id] [int] IDENTITY(1,1) NOT NULL,
	[criteria_name] [nvarchar](100) NULL,
	[max_score] [int] NULL,
	[num_options] [int] NULL,
	[created_by] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
 CONSTRAINT [PK__Criteria__401F949D669B4D18] PRIMARY KEY CLUSTERED 
(
	[criteria_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Decision_Criteria]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Decision_Criteria](
	[decision_id] [int] NOT NULL,
	[criteria_id] [int] NOT NULL,
	[weight] [float] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[decision_id] ASC,
	[criteria_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Decision_Tasks]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Decision_Tasks](
	[decision_id] [int] NOT NULL,
	[task_id] [int] NOT NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[decision_id] ASC,
	[task_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employee]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employee](
	[employee_id] [int] NOT NULL,
	[employee_name] [nvarchar](100) NOT NULL,
	[group_id] [int] NULL,
	[bulk_import_id] [int] NULL,
	[ranking_decision_id] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
 CONSTRAINT [PK__Employee__C52E0BA891B6DE09] PRIMARY KEY CLUSTERED 
(
	[employee_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employee_Criteria]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employee_Criteria](
	[employee_id] [int] NOT NULL,
	[criteria_id] [int] NOT NULL,
	[option_id] [int] NULL,
 CONSTRAINT [PK_Employee_Criteria] PRIMARY KEY CLUSTERED 
(
	[employee_id] ASC,
	[criteria_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[feedback]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[feedback](
	[feedback_id] [int] IDENTITY(1,1) NOT NULL,
	[note] [nvarchar](max) NULL,
	[decision_id] [int] NULL,
	[created_by] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
 CONSTRAINT [PK_Note] PRIMARY KEY CLUSTERED 
(
	[feedback_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Options]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Options](
	[option_id] [int] IDENTITY(1,1) NOT NULL,
	[criteria_id] [int] NULL,
	[option_name] [nvarchar](100) NULL,
	[score] [int] NULL,
	[description] [nvarchar](max) NULL,
	[created_by] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
 CONSTRAINT [PK__Options__F4EACE1BD6305DC2] PRIMARY KEY CLUSTERED 
(
	[option_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ranking_Decision]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ranking_Decision](
	[decision_id] [int] IDENTITY(1,1) NOT NULL,
	[decision_name] [nvarchar](100) NULL,
	[status] [nvarchar](50) NULL,
	[finalized_at] [datetime] NULL,
	[finalized_by] [int] NULL,
	[created_by] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
 CONSTRAINT [PK__Ranking___7F66496C41B62117] PRIMARY KEY CLUSTERED 
(
	[decision_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ranking_Group]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ranking_Group](
	[group_id] [int] IDENTITY(1,1) NOT NULL,
	[group_name] [nvarchar](100) NULL,
	[num_employees] [int] NULL,
	[current_ranking_decision] [int] NULL,
	[created_by] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
 CONSTRAINT [PK__Ranking___D57795A0E1337E23] PRIMARY KEY CLUSTERED 
(
	[group_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ranking_Title]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ranking_Title](
	[ranking_title_id] [int] IDENTITY(1,1) NOT NULL,
	[decision_id] [int] NULL,
	[title_name] [nvarchar](100) NULL,
	[total_score] [float] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
 CONSTRAINT [PK__Ranking___A7BE704532B3952F] PRIMARY KEY CLUSTERED 
(
	[ranking_title_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ranking_Title_Option]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ranking_Title_Option](
	[ranking_title_id] [int] NOT NULL,
	[option_id] [int] NOT NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ranking_title_id] ASC,
	[option_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role](
	[role_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NULL,
 CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED 
(
	[role_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[System_Log]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[System_Log](
	[log_id] [int] IDENTITY(1,1) NOT NULL,
	[account_id] [int] NULL,
	[action] [nvarchar](255) NULL,
	[log_time] [datetime] NULL,
	[ip_address] [nvarchar](50) NULL,
	[user_agent] [nvarchar](255) NULL,
 CONSTRAINT [PK__System_L__9E2397E026ABD589] PRIMARY KEY CLUSTERED 
(
	[log_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Task]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Task](
	[task_id] [int] IDENTITY(1,1) NOT NULL,
	[task_name] [nvarchar](100) NULL,
	[created_by] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
 CONSTRAINT [PK__Task__0492148DEEFF82E7] PRIMARY KEY CLUSTERED 
(
	[task_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Task_Wages]    Script Date: 12/20/2024 2:57:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Task_Wages](
	[ranking_title_id] [int] NOT NULL,
	[task_id] [int] NOT NULL,
	[working_hour_wage] [float] NULL,
	[overtime_wage] [float] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ranking_title_id] ASC,
	[task_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Account] ON 

INSERT [dbo].[Account] ([account_id], [username], [password_hash], [email], [role_id], [status], [full_name], [date_of_birth], [address], [phone_number], [gender], [token], [token_expiration], [created_at], [updated_at]) VALUES (1, N'duonglbq', N'111', N'duonglbq@gmail.com', 3, N'1', N'Luu Ba Quy Duong', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Account] ([account_id], [username], [password_hash], [email], [role_id], [status], [full_name], [date_of_birth], [address], [phone_number], [gender], [token], [token_expiration], [created_at], [updated_at]) VALUES (2, N'1', N'1', N'quatbt@gmail.com', 1, N'1', N'bui tien quat', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Account] ([account_id], [username], [password_hash], [email], [role_id], [status], [full_name], [date_of_birth], [address], [phone_number], [gender], [token], [token_expiration], [created_at], [updated_at]) VALUES (3, N'admin', N'1', N'hihi@pro.vip', 1, N'1', N'hihi@pro.vip', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Account] ([account_id], [username], [password_hash], [email], [role_id], [status], [full_name], [date_of_birth], [address], [phone_number], [gender], [token], [token_expiration], [created_at], [updated_at]) VALUES (4, N'manager', N'1', N'1@pro.pro', 2, N'1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[Account] OFF
GO
SET IDENTITY_INSERT [dbo].[Bulk_Ranking_History] ON 

INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (1, N'test_1', N'D:\upload\1732767152488-Worksheet_in_SRS_RankingManagement.xlsx', 1, CAST(N'2024-11-07T11:23:23.633' AS DateTime), 1, N'Success', N'1')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (2, N'1733124025474-Selected_Employees.xlsx', N'D:\upload\1733124025474-Selected_Employees.xlsx', 1, CAST(N'2024-12-02T14:20:25.543' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (3, N'1733124042381-Selected_Employees.xlsx', N'D:\upload\1733124042381-Selected_Employees.xlsx', 1, CAST(N'2024-12-02T14:20:42.407' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (4, N'1733124048811-Test_Upload_Failed.xlsx', N'D:\upload\1733124048811-Test_Upload_Failed.xlsx', 1, CAST(N'2024-12-02T14:20:48.830' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (5, N'1733297245928-Test_Upload_Failed.xlsx', N'D:\upload\1733297245928-Test_Upload_Failed.xlsx', 1, CAST(N'2024-12-04T14:27:26.057' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (6, N'1733298195917-Selected_Employees.xlsx', N'D:\upload\1733298195917-Selected_Employees.xlsx', 1, CAST(N'2024-12-04T14:43:16.097' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (7, N'1733298306378-Selected_Employees.xlsx', N'D:\upload\1733298306378-Selected_Employees.xlsx', 1, CAST(N'2024-12-04T14:45:06.393' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (8, N'1733371767474-Selected_Employees.xlsx', N'D:\upload\1733371767474-Selected_Employees.xlsx', 1, CAST(N'2024-12-05T11:09:27.520' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (9, N'1733371904425-Worksheet_in_SRS_RankingManagement.xlsx', N'D:\upload\1733371904425-Worksheet_in_SRS_RankingManagement.xlsx', 1, CAST(N'2024-12-05T11:11:44.440' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (10, N'1733372572740-Selected_Employees.xlsx', N'D:\upload\1733372572740-Selected_Employees.xlsx', 1, CAST(N'2024-12-05T11:22:52.753' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (11, N'1733384502728-Selected_Employees.xlsx', N'D:\upload\1733384502728-Selected_Employees.xlsx', 1, CAST(N'2024-12-05T14:41:42.790' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (12, N'1733384644294-Selected_Employees.xlsx', N'D:\upload\1733384644294-Selected_Employees.xlsx', 1, CAST(N'2024-12-05T14:44:04.340' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (13, N'1733384648921-Worksheet_in_SRS_RankingManagement.xlsx', N'D:\upload\1733384648921-Worksheet_in_SRS_RankingManagement.xlsx', 1, CAST(N'2024-12-05T14:44:08.930' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (14, N'1733384680997-Selected_Employees.xlsx', N'D:\upload\1733384680997-Selected_Employees.xlsx', 1, CAST(N'2024-12-05T14:44:41.020' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (15, N'1733384775921-Selected_Employees.xlsx', N'D:\upload\1733384775921-Selected_Employees.xlsx', 1, CAST(N'2024-12-05T14:46:15.943' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (16, N'1733384791411-Selected_Employees.xlsx', N'D:\upload\1733384791411-Selected_Employees.xlsx', 1, CAST(N'2024-12-05T14:46:31.437' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (17, N'1733385294385-Selected_Employees.xlsx', N'D:\upload\1733385294385-Selected_Employees.xlsx', 1, CAST(N'2024-12-05T14:54:54.427' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (18, N'1733385323807-Selected_Employees.xlsx', N'D:\upload\1733385323807-Selected_Employees.xlsx', 1, CAST(N'2024-12-05T14:55:23.817' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (19, N'1733473427210-Selected_Employees.xlsx', N'D:\upload\1733473427210-Selected_Employees.xlsx', 1, CAST(N'2024-12-06T15:23:47.263' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (20, N'1733474757871-Selected_Employees.xlsx', N'D:\upload\1733474757871-Selected_Employees.xlsx', 1, CAST(N'2024-12-06T15:45:57.937' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (21, N'1733474888665-Selected_Employees.xlsx', N'D:\upload\1733474888665-Selected_Employees.xlsx', 1, CAST(N'2024-12-06T15:48:08.740' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (22, N'1733669897087-Selected_Employees.xlsx', N'D:\upload\1733669897087-Selected_Employees.xlsx', 2, CAST(N'2024-12-08T21:58:17.160' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (23, N'1733669934652-Selected_Employees.xlsx', N'D:\upload\1733669934652-Selected_Employees.xlsx', 4, CAST(N'2024-12-08T21:58:54.663' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (24, N'1733670035455-Selected_Employees.xlsx', N'D:\upload\1733670035455-Selected_Employees.xlsx', 1, CAST(N'2024-12-08T22:00:35.483' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (25, N'1733670783657-Generated_Employer_Data_1000.xlsx', N'D:\upload\1733670783657-Generated_Employer_Data_1000.xlsx', 4, CAST(N'2024-12-08T22:13:03.720' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (26, N'1733670796061-Generated_Employer_Data_1000.xlsx', N'D:\upload\1733670796061-Generated_Employer_Data_1000.xlsx', 4, CAST(N'2024-12-08T22:13:16.077' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (27, N'1733671974025-Selected_Employees.xlsx', N'D:\upload\1733671974025-Selected_Employees.xlsx', 1401500, CAST(N'2024-12-08T22:32:54.100' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (28, N'1733717832973-Generated_Employer_Data_1000.xlsx', N'D:\upload\1733717832973-Generated_Employer_Data_1000.xlsx', 1, CAST(N'2024-12-09T11:17:12.997' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (29, N'1734276200811-Selected_Employees.xlsx', N'D:\upload\1734276200811-Selected_Employees.xlsx', 1, CAST(N'2024-12-15T22:23:20.863' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (30, N'1734510568630-t.xlsx', N'D:\upload\1734510568630-t.xlsx', 1, CAST(N'2024-12-18T15:29:28.727' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (31, N'1734510698163-Selected_Employees.xlsx', N'D:\upload\1734510698163-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T15:31:38.190' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (32, N'1734510747210-Selected_Employees.xlsx', N'D:\upload\1734510747210-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T15:32:27.237' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (33, N'1734510959769-Selected_Employees.xlsx', N'D:\upload\1734510959769-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T15:35:59.783' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (34, N'1734510982859-Selected_Employees.xlsx', N'D:\upload\1734510982859-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T15:36:22.890' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (35, N'1734511077864-Selected_Employees.xlsx', N'D:\upload\1734511077864-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T15:37:57.887' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (36, N'1734511745281-Selected_Employees.xlsx', N'D:\upload\1734511745281-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T15:49:05.343' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (37, N'1734511945844-Selected_Employees.xlsx', N'D:\upload\1734511945844-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T15:52:25.910' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (38, N'1734512051968-Selected_Employees.xlsx', N'D:\upload\1734512051968-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T15:54:12.050' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (39, N'1734512084098-Selected_Employees.xlsx', N'D:\upload\1734512084098-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T15:54:44.113' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (40, N'1734513855034-Selected_Employees.xlsx', N'D:\upload\1734513855034-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T16:24:15.103' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (41, N'1734540552775-Selected_Employees.xlsx', N'D:\upload\1734540552775-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T23:49:12.887' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (42, N'1734540568471-Selected_Employees.xlsx', N'D:\upload\1734540568471-Selected_Employees.xlsx', 2, CAST(N'2024-12-18T23:49:28.483' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (43, N'1734540651655-Selected_Employees.xlsx', N'D:\upload\1734540651655-Selected_Employees.xlsx', 2, CAST(N'2024-12-18T23:50:51.760' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (44, N'1734540688934-Selected_Employees.xlsx', N'D:\upload\1734540688934-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T23:51:28.950' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (45, N'1734540803351-Selected_Employees.xlsx', N'D:\upload\1734540803351-Selected_Employees.xlsx', 1, CAST(N'2024-12-18T23:53:23.383' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (46, N'1734540824935-Selected_Employees.xlsx', N'D:\upload\1734540824935-Selected_Employees.xlsx', 4, CAST(N'2024-12-18T23:53:44.947' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (47, N'1734598767532-Selected_Employees.xlsx', N'D:\upload\1734598767532-Selected_Employees.xlsx', 1401500, CAST(N'2024-12-19T15:59:27.600' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (49, N'1734598832654-Selected_Employees.xlsx', N'D:\upload\1734598832654-Selected_Employees.xlsx', 3, CAST(N'2024-12-19T16:00:32.700' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (51, N'1734602012755-Selected_Employees.xlsx', N'D:\upload\1734602012755-Selected_Employees.xlsx', 2, CAST(N'2024-12-19T16:53:32.773' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (52, N'1734602030040-Selected_Employees.xlsx', N'D:\upload\1734602030040-Selected_Employees.xlsx', 3, CAST(N'2024-12-19T16:53:50.050' AS DateTime), 1, N'Success', N'')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (53, N'1734628303298-Selected_Employees.xlsx', N'D:\upload\1734628303298-Selected_Employees.xlsx', 2, CAST(N'2024-12-20T00:11:43.380' AS DateTime), 1, N'Failed', N'Wrong value input for criteria options. Update and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (54, N'1734628340002-Selected_Employees.xlsx', N'D:\upload\1734628340002-Selected_Employees.xlsx', 2, CAST(N'2024-12-20T00:12:20.020' AS DateTime), 1, N'Failed', N'Wrong value input for criteria options. Update and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (55, N'1734628352118-11.xlsx', N'D:\upload\1734628352118-11.xlsx', 2, CAST(N'2024-12-20T00:12:32.137' AS DateTime), 1, N'Failed', N'Wrong value input for criteria options. Update and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (56, N'1734628359606-11.xlsx', N'D:\upload\1734628359606-11.xlsx', 2, CAST(N'2024-12-20T00:12:39.650' AS DateTime), 1, N'Failed', N'Wrong value input for criteria options. Update and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (57, N'1734628491122-11.xlsx', N'D:\upload\1734628491122-11.xlsx', 2, CAST(N'2024-12-20T00:14:51.167' AS DateTime), 1, N'Failed', N'Wrong value input for criteria options. Update and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (58, N'1734628498307-11.xlsx', N'D:\upload\1734628498307-11.xlsx', 2, CAST(N'2024-12-20T00:14:58.353' AS DateTime), 1, N'Failed', N'Wrong value input for criteria options. Update and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (59, N'1734628523336-11.xlsx', N'D:\upload\1734628523336-11.xlsx', 2, CAST(N'2024-12-20T00:15:23.360' AS DateTime), 1, N'Failed', N'Wrong value input for criteria options. Update and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (60, N'1734628630407-nnn.xlsx', N'D:\upload\1734628630407-nnn.xlsx', 2, CAST(N'2024-12-20T00:17:10.437' AS DateTime), 1, N'Failed', N'Wrong value input for criteria options. Update and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (61, N'1734628642240-nnn.xlsx', N'D:\upload\1734628642240-nnn.xlsx', 2, CAST(N'2024-12-20T00:17:22.250' AS DateTime), 1, N'Failed', N'Wrong value input for criteria options. Update and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (62, N'1734628821105-test.xlsx', N'D:\upload\1734628821105-test.xlsx', 2, CAST(N'2024-12-20T00:20:21.120' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
INSERT [dbo].[Bulk_Ranking_History] ([history_id], [file_name], [file_path], [ranking_group_id], [upload_at], [upload_by], [status], [note]) VALUES (63, N'1734628909763-test.xlsx', N'D:\upload\1734628909763-test.xlsx', 2, CAST(N'2024-12-20T00:21:49.810' AS DateTime), 1, N'Failed', N'Wrong value template. Re-download latest template and try again.')
SET IDENTITY_INSERT [dbo].[Bulk_Ranking_History] OFF
GO
SET IDENTITY_INSERT [dbo].[Criteria] ON 

INSERT [dbo].[Criteria] ([criteria_id], [criteria_name], [max_score], [num_options], [created_by], [created_at], [updated_at]) VALUES (1, N'Scope of Training Assignments', 4, 4, 1, CAST(N'2024-11-25T16:09:44.590' AS DateTime), CAST(N'2024-11-25T16:09:44.590' AS DateTime))
INSERT [dbo].[Criteria] ([criteria_id], [criteria_name], [max_score], [num_options], [created_by], [created_at], [updated_at]) VALUES (2, N'Technical or Professional Skills', 6, 6, 1, CAST(N'2024-11-25T16:09:44.590' AS DateTime), CAST(N'2024-11-25T16:09:44.590' AS DateTime))
INSERT [dbo].[Criteria] ([criteria_id], [criteria_name], [max_score], [num_options], [created_by], [created_at], [updated_at]) VALUES (3, N'Courseraware Development', 6, 6, 1, CAST(N'2024-11-25T16:09:44.590' AS DateTime), CAST(N'2024-11-25T16:09:44.590' AS DateTime))
INSERT [dbo].[Criteria] ([criteria_id], [criteria_name], [max_score], [num_options], [created_by], [created_at], [updated_at]) VALUES (4, N'Training and Mentoring Skills', 6, 6, 1, CAST(N'2024-11-25T16:09:44.590' AS DateTime), CAST(N'2024-11-25T16:09:44.590' AS DateTime))
INSERT [dbo].[Criteria] ([criteria_id], [criteria_name], [max_score], [num_options], [created_by], [created_at], [updated_at]) VALUES (5, N'Training Certificate', 6, 6, 1, CAST(N'2024-11-25T16:09:44.590' AS DateTime), CAST(N'2024-11-25T16:09:44.590' AS DateTime))
INSERT [dbo].[Criteria] ([criteria_id], [criteria_name], [max_score], [num_options], [created_by], [created_at], [updated_at]) VALUES (6, N'Years of Working and Teaching', 5, 5, 1, CAST(N'2024-11-25T16:09:44.590' AS DateTime), CAST(N'2024-11-25T16:09:44.590' AS DateTime))
SET IDENTITY_INSERT [dbo].[Criteria] OFF
GO
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (1, 1, 10, CAST(N'2024-11-25T16:09:44.593' AS DateTime), CAST(N'2024-11-25T16:09:44.593' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (1, 2, 10, CAST(N'2024-11-25T16:09:44.593' AS DateTime), CAST(N'2024-11-25T16:09:44.593' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (1, 3, 30, CAST(N'2024-11-25T16:09:44.593' AS DateTime), CAST(N'2024-11-25T16:09:44.593' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (1, 4, 10, CAST(N'2024-11-25T16:09:44.593' AS DateTime), CAST(N'2024-11-25T16:09:44.593' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (1, 5, 30, CAST(N'2024-11-25T16:09:44.593' AS DateTime), CAST(N'2024-11-25T16:09:44.593' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (1, 6, 10, CAST(N'2024-11-25T16:09:44.593' AS DateTime), CAST(N'2024-11-25T16:09:44.593' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (2, 1, 10, CAST(N'2024-11-25T16:09:44.593' AS DateTime), CAST(N'2024-12-07T17:32:51.903' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (2, 2, 10, CAST(N'2024-11-25T16:09:44.593' AS DateTime), CAST(N'2024-12-07T17:32:51.907' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (2, 3, 30, CAST(N'2024-11-25T16:09:44.593' AS DateTime), CAST(N'2024-12-07T17:32:51.910' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (2, 4, 10, CAST(N'2024-11-25T16:09:44.593' AS DateTime), CAST(N'2024-12-07T17:32:51.910' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (2, 5, 30, CAST(N'2024-11-25T16:09:44.593' AS DateTime), CAST(N'2024-12-07T17:32:51.910' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (2, 6, 10, CAST(N'2024-11-25T16:09:44.593' AS DateTime), CAST(N'2024-12-07T17:32:51.913' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (3, 2, 100, CAST(N'2024-12-10T21:32:15.333' AS DateTime), CAST(N'2024-12-10T21:32:15.333' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (4, 1, 10, CAST(N'2024-12-05T11:14:49.353' AS DateTime), CAST(N'2024-12-05T11:16:47.000' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (4, 2, 90, CAST(N'2024-12-05T11:14:49.353' AS DateTime), CAST(N'2024-12-05T11:16:47.000' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (75, 1, 100, CAST(N'2024-12-19T11:47:13.603' AS DateTime), CAST(N'2024-12-19T11:47:13.603' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (82, 1, 10, CAST(N'2024-12-20T00:13:39.563' AS DateTime), CAST(N'2024-12-20T00:13:39.667' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (82, 2, 10, CAST(N'2024-12-20T00:13:39.563' AS DateTime), CAST(N'2024-12-20T00:13:39.670' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (82, 3, 30, CAST(N'2024-12-20T00:13:39.563' AS DateTime), CAST(N'2024-12-20T00:13:39.670' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (82, 4, 10, CAST(N'2024-12-20T00:13:39.563' AS DateTime), CAST(N'2024-12-20T00:13:39.670' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (82, 5, 30, CAST(N'2024-12-20T00:13:39.563' AS DateTime), CAST(N'2024-12-20T00:13:39.670' AS DateTime))
INSERT [dbo].[Decision_Criteria] ([decision_id], [criteria_id], [weight], [created_at], [updated_at]) VALUES (82, 6, 10, CAST(N'2024-12-20T00:13:39.563' AS DateTime), CAST(N'2024-12-20T00:13:39.670' AS DateTime))
GO
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (1, 1, CAST(N'2024-11-07T11:23:23.633' AS DateTime), CAST(N'2024-11-07T11:23:23.633' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (1, 2, CAST(N'2024-11-07T11:23:23.633' AS DateTime), CAST(N'2024-11-07T11:23:23.633' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (1, 3, CAST(N'2024-11-07T11:23:23.633' AS DateTime), CAST(N'2024-11-07T11:23:23.633' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (1, 4, CAST(N'2024-11-07T11:23:23.633' AS DateTime), CAST(N'2024-11-07T11:23:23.633' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (1, 5, CAST(N'2024-11-07T11:23:23.633' AS DateTime), CAST(N'2024-11-07T11:23:23.633' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (2, 1, CAST(N'2024-11-07T11:23:23.633' AS DateTime), CAST(N'2024-11-07T11:23:23.633' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (2, 2, CAST(N'2024-11-07T11:23:23.633' AS DateTime), CAST(N'2024-11-07T11:23:23.633' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (2, 3, CAST(N'2024-11-07T11:23:23.633' AS DateTime), CAST(N'2024-11-07T11:23:23.633' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (3, 2, CAST(N'2024-12-10T00:00:00.000' AS DateTime), CAST(N'2024-12-10T00:00:00.000' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (4, 2, CAST(N'2024-12-10T00:00:00.000' AS DateTime), CAST(N'2024-12-10T00:00:00.000' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (75, 1, CAST(N'2024-12-19T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (82, 1, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (82, 2, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Decision_Tasks] ([decision_id], [task_id], [created_at], [updated_at]) VALUES (82, 3, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
GO
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (1, N'Bui Tien Quat', 1, 21, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-06T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (2, N'Mai Nhat Hoang', 1, 21, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-06T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (3, N'Pham Quang Duy', 1, 21, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-06T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (4, N'Le Ba Quy Duong', 1, 21, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-06T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (7, N'Bui Tien Qua', 2, 21, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-06T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (8, N'Mai Nhat', 2, 21, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-06T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (9, N'Le Ba Quy', 2, 21, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-06T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (10, N'Tran Thi Ba', 2, 21, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-06T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (11, N'Nguyen Van', 2, 21, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-06T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (673, N'Nguyen Van Abc', 3, 52, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (1796, N'Tran Thi B', 3, 52, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (3689, N'Nguyen Van A', 3, 52, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (4664, N'Bui Quang E', 3, 52, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (5050, N'Pham Thi D', 3, 52, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (5783, N'Nguyen Van A', 3, 52, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (6783, N'Nguyen Van Ab', 4, 52, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Employee] ([employee_id], [employee_name], [group_id], [bulk_import_id], [ranking_decision_id], [created_at], [updated_at]) VALUES (8717, N'Nguyen Van A', 4, 52, 2, CAST(N'2024-12-06T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
GO
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (1, 1, 4)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (1, 2, 9)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (1, 3, 14)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (1, 4, 19)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (1, 5, 24)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (1, 6, 29)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (2, 1, 2)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (2, 2, 8)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (2, 3, 12)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (2, 4, 17)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (2, 5, 22)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (2, 6, 27)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (3, 1, 2)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (3, 2, 7)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (3, 3, 13)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (3, 4, 17)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (3, 5, 22)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (3, 6, 27)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (4, 1, 2)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (4, 2, 8)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (4, 3, 12)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (4, 4, 17)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (4, 5, 22)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (4, 6, 27)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (673, 1, 1)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (673, 2, 6)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (673, 3, 12)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (673, 4, 16)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (673, 5, 21)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (673, 6, 26)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (1796, 1, 4)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (1796, 2, 9)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (1796, 3, 13)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (1796, 4, 19)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (1796, 5, 22)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (1796, 6, 28)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (3689, 1, 4)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (3689, 2, 8)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (3689, 3, 14)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (3689, 4, 19)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (3689, 5, 21)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (3689, 6, 26)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (4664, 1, 4)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (4664, 2, 7)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (4664, 3, 13)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (4664, 4, 18)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (4664, 5, 21)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (4664, 6, 27)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (5050, 1, 4)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (5050, 2, 8)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (5050, 3, 12)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (5050, 4, 16)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (5050, 5, 21)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (5050, 6, 28)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (5783, 1, 1)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (5783, 2, 6)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (5783, 3, 12)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (5783, 4, 16)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (5783, 5, 21)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (5783, 6, 26)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (6783, 1, 1)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (6783, 2, 6)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (6783, 3, 12)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (6783, 4, 16)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (6783, 5, 21)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (6783, 6, 26)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (8717, 1, 3)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (8717, 2, 6)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (8717, 3, 12)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (8717, 4, 17)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (8717, 5, 21)
INSERT [dbo].[Employee_Criteria] ([employee_id], [criteria_id], [option_id]) VALUES (8717, 6, 29)
GO
SET IDENTITY_INSERT [dbo].[feedback] ON 

INSERT [dbo].[feedback] ([feedback_id], [note], [decision_id], [created_by], [created_at], [updated_at]) VALUES (2, N'Test', 1, 3, CAST(N'2024-12-10T17:03:11.620' AS DateTime), CAST(N'2024-12-20T14:44:38.937' AS DateTime))
INSERT [dbo].[feedback] ([feedback_id], [note], [decision_id], [created_by], [created_at], [updated_at]) VALUES (3, N'ok', 2, 3, CAST(N'2024-12-10T17:14:35.803' AS DateTime), CAST(N'2024-12-20T14:47:14.180' AS DateTime))
INSERT [dbo].[feedback] ([feedback_id], [note], [decision_id], [created_by], [created_at], [updated_at]) VALUES (4, N'OK', 3, 3, CAST(N'2024-12-15T16:33:31.917' AS DateTime), CAST(N'2024-12-20T14:47:49.137' AS DateTime))
INSERT [dbo].[feedback] ([feedback_id], [note], [decision_id], [created_by], [created_at], [updated_at]) VALUES (6, N'ok', 4, 3, CAST(N'2024-12-19T17:03:18.970' AS DateTime), CAST(N'2024-12-20T14:45:54.350' AS DateTime))
INSERT [dbo].[feedback] ([feedback_id], [note], [decision_id], [created_by], [created_at], [updated_at]) VALUES (7, N'ok', 75, 3, CAST(N'2024-12-20T14:45:27.597' AS DateTime), CAST(N'2024-12-20T14:45:27.597' AS DateTime))
SET IDENTITY_INSERT [dbo].[feedback] OFF
GO
SET IDENTITY_INSERT [dbo].[Options] ON 

INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (1, 1, N'No experience', 0, N'No experience', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (2, 1, N'Normal', 1, N'Normal', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (3, 1, N'Medium', 2, N'Medium', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (4, 1, N'Complex', 3, N'Complex', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (5, 1, N'Very Complex', 4, N'Very Complex', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (6, 2, N'No experience', 0, N'No experience', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (7, 2, N'Normal', 1, N'Normal', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (8, 2, N'Medium', 2, N'Medium', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (9, 2, N'Complex', 3, N'Complex', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (10, 2, N'Very Complex', 4, N'Very Complex', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (11, 3, N'No experience', 0, N'No experience', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (12, 3, N'Normal', 1, N'Normal', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (13, 3, N'Medium', 2, N'Medium', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (14, 3, N'Complex', 3, N'Complex', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (15, 3, N'Very Complex', 4, N'Very Complex', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (16, 4, N'No experience', 0, N'No experience', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (17, 4, N'Normal', 1, N'Normal', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (18, 4, N'Medium', 2, N'Medium', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (19, 4, N'Complex', 3, N'Complex', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (20, 4, N'Very Complex', 4, N'Very Complex', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (21, 5, N'No experience', 0, N'No experience', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (22, 5, N'Normal', 1, N'Normal', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (23, 5, N'Medium', 2, N'Medium', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (24, 5, N'Complex', 3, N'Complex', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (25, 5, N'Very Complex', 4, N'Very Complex', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (26, 6, N'No experience', 0, N'No experience', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (27, 6, N'Normal', 1, N'Normal', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (28, 6, N'Medium', 2, N'Medium', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (29, 6, N'Complex', 3, N'Complex', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (30, 6, N'Very Complex', 4, N'Very Complex', 1, CAST(N'2024-11-25T16:09:44.607' AS DateTime), CAST(N'2024-11-25T16:09:44.607' AS DateTime))
INSERT [dbo].[Options] ([option_id], [criteria_id], [option_name], [score], [description], [created_by], [created_at], [updated_at]) VALUES (32, 1, N'good', 5, N'test', 2, CAST(N'2024-12-19T11:50:34.403' AS DateTime), CAST(N'2024-12-19T11:50:34.403' AS DateTime))
SET IDENTITY_INSERT [dbo].[Options] OFF
GO
SET IDENTITY_INSERT [dbo].[Ranking_Decision] ON 

INSERT [dbo].[Ranking_Decision] ([decision_id], [decision_name], [status], [finalized_at], [finalized_by], [created_by], [created_at], [updated_at]) VALUES (1, N'QĐ01/Fsoft/ASBCDEF', N'Finalized', CAST(N'2024-12-20T14:44:42.320' AS DateTime), 3, 1, CAST(N'2024-12-07T16:23:25.233' AS DateTime), CAST(N'2024-12-20T14:44:42.320' AS DateTime))
INSERT [dbo].[Ranking_Decision] ([decision_id], [decision_name], [status], [finalized_at], [finalized_by], [created_by], [created_at], [updated_at]) VALUES (2, N'QĐ02/Fsoft/ASBCDEF', N'Finalized', CAST(N'2024-12-20T14:47:20.377' AS DateTime), 3, 1, CAST(N'2024-12-07T16:23:25.233' AS DateTime), CAST(N'2024-12-20T14:47:20.377' AS DateTime))
INSERT [dbo].[Ranking_Decision] ([decision_id], [decision_name], [status], [finalized_at], [finalized_by], [created_by], [created_at], [updated_at]) VALUES (3, N'QĐ03/Fsoft/ASBCDEF', N'Finalized', CAST(N'2024-12-20T14:47:53.533' AS DateTime), 3, 1, CAST(N'2024-12-07T16:23:25.233' AS DateTime), CAST(N'2024-12-20T14:47:53.533' AS DateTime))
INSERT [dbo].[Ranking_Decision] ([decision_id], [decision_name], [status], [finalized_at], [finalized_by], [created_by], [created_at], [updated_at]) VALUES (4, N'QĐ04/Fsoft/ASBCDEF', N'Finalized', CAST(N'2024-12-20T14:45:54.423' AS DateTime), 3, 1, CAST(N'2024-12-07T16:23:25.233' AS DateTime), CAST(N'2024-12-20T14:45:54.423' AS DateTime))
INSERT [dbo].[Ranking_Decision] ([decision_id], [decision_name], [status], [finalized_at], [finalized_by], [created_by], [created_at], [updated_at]) VALUES (75, N'QĐ07/Fsoft/ASBCDEF', N'Finalized', CAST(N'2024-12-20T14:45:31.980' AS DateTime), 3, 2, CAST(N'2024-12-19T11:46:58.783' AS DateTime), CAST(N'2024-12-20T14:45:31.980' AS DateTime))
INSERT [dbo].[Ranking_Decision] ([decision_id], [decision_name], [status], [finalized_at], [finalized_by], [created_by], [created_at], [updated_at]) VALUES (82, N'QĐ05/Fsoft/ASBCDEF', N'Finalized', CAST(N'2024-12-20T14:50:11.600' AS DateTime), 3, 2, CAST(N'2024-12-20T00:13:39.557' AS DateTime), CAST(N'2024-12-20T14:50:11.600' AS DateTime))
SET IDENTITY_INSERT [dbo].[Ranking_Decision] OFF
GO
SET IDENTITY_INSERT [dbo].[Ranking_Group] ON 

INSERT [dbo].[Ranking_Group] ([group_id], [group_name], [num_employees], [current_ranking_decision], [created_by], [created_at], [updated_at]) VALUES (1, N'Marketing Clerk', 12, 2, 1, CAST(N'2024-12-18T23:53:23.513' AS DateTime), CAST(N'2024-12-18T23:53:23.513' AS DateTime))
INSERT [dbo].[Ranking_Group] ([group_id], [group_name], [num_employees], [current_ranking_decision], [created_by], [created_at], [updated_at]) VALUES (2, N'Supporter', 8, 75, 1, CAST(N'2024-12-18T23:53:23.513' AS DateTime), CAST(N'2024-12-20T00:14:40.807' AS DateTime))
INSERT [dbo].[Ranking_Group] ([group_id], [group_name], [num_employees], [current_ranking_decision], [created_by], [created_at], [updated_at]) VALUES (3, N'Trainer', 8, 4, 1, CAST(N'2024-12-18T23:53:23.513' AS DateTime), CAST(N'2024-12-19T22:20:24.963' AS DateTime))
INSERT [dbo].[Ranking_Group] ([group_id], [group_name], [num_employees], [current_ranking_decision], [created_by], [created_at], [updated_at]) VALUES (4, N'Developer', 8, 2, 1, CAST(N'2024-11-07T11:23:23.633' AS DateTime), CAST(N'2024-12-18T23:53:45.047' AS DateTime))
INSERT [dbo].[Ranking_Group] ([group_id], [group_name], [num_employees], [current_ranking_decision], [created_by], [created_at], [updated_at]) VALUES (1401500, N'Tester', 8, 75, 1, CAST(N'2024-12-08T22:23:02.840' AS DateTime), CAST(N'2024-12-19T15:59:27.750' AS DateTime))
SET IDENTITY_INSERT [dbo].[Ranking_Group] OFF
GO
SET IDENTITY_INSERT [dbo].[Ranking_Title] ON 

INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (1, 1, N'TRN1.1', 57, CAST(N'2024-11-07T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (2, 1, N'TRN1.2', 55, CAST(N'2024-11-07T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (3, 1, N'TRN1.3', 64, CAST(N'2024-11-07T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (4, 1, N'TRN2.1', 88, CAST(N'2024-11-07T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (10, 2, N'TRN1.1', 30, CAST(N'2024-11-07T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (11, 2, N'TRN1.2', 24.5, CAST(N'2024-11-07T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (12, 2, N'TRN1.3', 34, CAST(N'2024-11-07T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (13, 2, N'TRN2.1', 80.5, CAST(N'2024-11-07T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (296, 4, N'TRN1.1', 69.5, CAST(N'2024-12-19T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (297, 4, N'TRN2.2', 53, CAST(N'2024-12-19T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (298, 75, N'DDD', 0, CAST(N'2024-12-19T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (324, 82, N'TRN1.1', 30, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (325, 82, N'TRN1.2', 24.5, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (326, 82, N'TRN1.3', 34, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (327, 82, N'TRN2.1', 80.5, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title] ([ranking_title_id], [decision_id], [title_name], [total_score], [created_at], [updated_at]) VALUES (332, 3, N'TRN1.1', 75, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
SET IDENTITY_INSERT [dbo].[Ranking_Title] OFF
GO
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (1, 2, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (1, 8, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (1, 14, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (1, 19, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (1, 23, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (1, 28, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (2, 1, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (2, 7, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (2, 14, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (2, 19, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (2, 23, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (2, 29, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (3, 3, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (3, 8, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (3, 14, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (3, 18, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (3, 24, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (3, 28, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (4, 5, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (4, 9, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (4, 14, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (4, 20, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (4, 25, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (4, 30, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (10, 1, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (10, 6, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (10, 13, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (10, 17, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (10, 22, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (10, 28, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (11, 2, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (11, 7, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (11, 12, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (11, 17, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (11, 22, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (11, 27, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (12, 3, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (12, 8, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (12, 13, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (12, 18, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (12, 21, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (12, 28, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (13, 5, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (13, 10, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (13, 15, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (13, 20, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (13, 23, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (13, 29, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (296, 2, CAST(N'2024-12-19T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (296, 9, CAST(N'2024-12-19T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (297, 5, CAST(N'2024-12-19T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (297, 8, CAST(N'2024-12-19T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (298, 1, CAST(N'2024-12-19T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (324, 1, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (324, 6, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (324, 13, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (324, 17, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (324, 22, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (324, 28, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (325, 2, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (325, 7, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (325, 12, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (325, 17, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (325, 22, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (325, 27, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (326, 3, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (326, 8, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (326, 13, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (326, 18, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (326, 21, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (326, 28, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (327, 5, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (327, 10, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (327, 15, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (327, 20, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (327, 23, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (327, 29, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Ranking_Title_Option] ([ranking_title_id], [option_id], [created_at], [updated_at]) VALUES (332, 9, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Role] ON 

INSERT [dbo].[Role] ([role_id], [name]) VALUES (1, N'ADMIN')
INSERT [dbo].[Role] ([role_id], [name]) VALUES (2, N'MANAGER')
INSERT [dbo].[Role] ([role_id], [name]) VALUES (3, N'USER')
SET IDENTITY_INSERT [dbo].[Role] OFF
GO
SET IDENTITY_INSERT [dbo].[Task] ON 

INSERT [dbo].[Task] ([task_id], [task_name], [created_by], [created_at], [updated_at]) VALUES (1, N'Exam Online', 2, CAST(N'2024-12-19T11:42:01.017' AS DateTime), CAST(N'2024-12-19T11:42:01.017' AS DateTime))
INSERT [dbo].[Task] ([task_id], [task_name], [created_by], [created_at], [updated_at]) VALUES (2, N'Instructions', 2, CAST(N'2024-12-19T11:42:01.017' AS DateTime), CAST(N'2024-12-19T11:41:36.827' AS DateTime))
INSERT [dbo].[Task] ([task_id], [task_name], [created_by], [created_at], [updated_at]) VALUES (3, N'Create documents', 2, CAST(N'2024-12-19T11:42:01.017' AS DateTime), CAST(N'2024-12-19T11:41:13.037' AS DateTime))
INSERT [dbo].[Task] ([task_id], [task_name], [created_by], [created_at], [updated_at]) VALUES (4, N'Check questions', 2, CAST(N'2024-12-19T11:42:01.017' AS DateTime), CAST(N'2024-12-19T11:40:57.517' AS DateTime))
INSERT [dbo].[Task] ([task_id], [task_name], [created_by], [created_at], [updated_at]) VALUES (5, N'Review documents', 2, CAST(N'2024-12-19T11:42:01.017' AS DateTime), CAST(N'2024-12-19T11:40:26.537' AS DateTime))
INSERT [dbo].[Task] ([task_id], [task_name], [created_by], [created_at], [updated_at]) VALUES (10, N'Lecture', 2, CAST(N'2024-12-19T11:42:01.017' AS DateTime), CAST(N'2024-12-19T11:42:01.017' AS DateTime))
SET IDENTITY_INSERT [dbo].[Task] OFF
GO
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (1, 1, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (1, 2, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (1, 3, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (1, 4, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (1, 5, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (2, 1, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (2, 2, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (2, 3, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (2, 4, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (2, 5, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (3, 1, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (3, 2, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (3, 3, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (3, 4, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (3, 5, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (4, 1, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (4, 2, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (4, 3, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (4, 4, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (4, 5, 1000, 2000, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (10, 1, 100, 200, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (10, 2, 100, 200, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (10, 3, 100, 200, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (11, 1, 100, 200, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (11, 2, 100, 200, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (11, 3, 100, 200, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (12, 1, 100, 200, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (12, 2, 100, 200, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (12, 3, 100, 200, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (13, 1, 100, 200, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (13, 2, 100, 200, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (13, 3, 100, 200, CAST(N'2024-12-18T00:00:00.000' AS DateTime), CAST(N'2024-12-18T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (296, 2, 1000, 2000, CAST(N'2024-12-19T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (297, 2, 1000, 2000, CAST(N'2024-12-19T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (298, 1, 1, 1, CAST(N'2024-12-19T00:00:00.000' AS DateTime), CAST(N'2024-12-19T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (324, 1, 100, 200, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (324, 2, 100, 200, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (324, 3, 100, 200, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (325, 1, 100, 200, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (325, 2, 100, 200, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (325, 3, 100, 200, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (326, 1, 100, 200, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (326, 2, 100, 200, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (326, 3, 100, 200, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (327, 1, 100, 200, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (327, 2, 100, 200, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (327, 3, 100, 200, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
INSERT [dbo].[Task_Wages] ([ranking_title_id], [task_id], [working_hour_wage], [overtime_wage], [created_at], [updated_at]) VALUES (332, 2, 100, 100, CAST(N'2024-12-20T00:00:00.000' AS DateTime), CAST(N'2024-12-20T00:00:00.000' AS DateTime))
GO
ALTER TABLE [dbo].[Account]  WITH CHECK ADD  CONSTRAINT [FK_Account_Role] FOREIGN KEY([role_id])
REFERENCES [dbo].[Role] ([role_id])
GO
ALTER TABLE [dbo].[Account] CHECK CONSTRAINT [FK_Account_Role]
GO
ALTER TABLE [dbo].[Bulk_Ranking_History]  WITH CHECK ADD  CONSTRAINT [FK__Bulk_Rank__uploa__571DF1D5] FOREIGN KEY([upload_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Bulk_Ranking_History] CHECK CONSTRAINT [FK__Bulk_Rank__uploa__571DF1D5]
GO
ALTER TABLE [dbo].[Bulk_Ranking_History]  WITH CHECK ADD  CONSTRAINT [FK_Bulk_Ranking_History_Ranking_Group] FOREIGN KEY([ranking_group_id])
REFERENCES [dbo].[Ranking_Group] ([group_id])
GO
ALTER TABLE [dbo].[Bulk_Ranking_History] CHECK CONSTRAINT [FK_Bulk_Ranking_History_Ranking_Group]
GO
ALTER TABLE [dbo].[Criteria]  WITH CHECK ADD  CONSTRAINT [FK__Criteria__create__5812160E] FOREIGN KEY([created_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Criteria] CHECK CONSTRAINT [FK__Criteria__create__5812160E]
GO
ALTER TABLE [dbo].[Decision_Criteria]  WITH CHECK ADD  CONSTRAINT [FK__Decision___crite__59063A47] FOREIGN KEY([criteria_id])
REFERENCES [dbo].[Criteria] ([criteria_id])
GO
ALTER TABLE [dbo].[Decision_Criteria] CHECK CONSTRAINT [FK__Decision___crite__59063A47]
GO
ALTER TABLE [dbo].[Decision_Criteria]  WITH CHECK ADD  CONSTRAINT [FK__Decision___decis__59FA5E80] FOREIGN KEY([decision_id])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[Decision_Criteria] CHECK CONSTRAINT [FK__Decision___decis__59FA5E80]
GO
ALTER TABLE [dbo].[Decision_Tasks]  WITH CHECK ADD  CONSTRAINT [FK__Decision___decis__5AEE82B9] FOREIGN KEY([decision_id])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[Decision_Tasks] CHECK CONSTRAINT [FK__Decision___decis__5AEE82B9]
GO
ALTER TABLE [dbo].[Decision_Tasks]  WITH CHECK ADD  CONSTRAINT [FK__Decision___task___5BE2A6F2] FOREIGN KEY([task_id])
REFERENCES [dbo].[Task] ([task_id])
GO
ALTER TABLE [dbo].[Decision_Tasks] CHECK CONSTRAINT [FK__Decision___task___5BE2A6F2]
GO
ALTER TABLE [dbo].[Employee]  WITH CHECK ADD  CONSTRAINT [FK__Employee__bulk_i__5EBF139D] FOREIGN KEY([bulk_import_id])
REFERENCES [dbo].[Bulk_Ranking_History] ([history_id])
GO
ALTER TABLE [dbo].[Employee] CHECK CONSTRAINT [FK__Employee__bulk_i__5EBF139D]
GO
ALTER TABLE [dbo].[Employee]  WITH CHECK ADD  CONSTRAINT [FK__Employee__rankin__60A75C0F] FOREIGN KEY([ranking_decision_id])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[Employee] CHECK CONSTRAINT [FK__Employee__rankin__60A75C0F]
GO
ALTER TABLE [dbo].[Employee]  WITH CHECK ADD  CONSTRAINT [FK_Employee_Ranking_Group] FOREIGN KEY([group_id])
REFERENCES [dbo].[Ranking_Group] ([group_id])
GO
ALTER TABLE [dbo].[Employee] CHECK CONSTRAINT [FK_Employee_Ranking_Group]
GO
ALTER TABLE [dbo].[Employee_Criteria]  WITH CHECK ADD  CONSTRAINT [FK_Employee_Criteria_Criteria] FOREIGN KEY([criteria_id])
REFERENCES [dbo].[Criteria] ([criteria_id])
GO
ALTER TABLE [dbo].[Employee_Criteria] CHECK CONSTRAINT [FK_Employee_Criteria_Criteria]
GO
ALTER TABLE [dbo].[Employee_Criteria]  WITH CHECK ADD  CONSTRAINT [FK_Employee_Criteria_Employee] FOREIGN KEY([employee_id])
REFERENCES [dbo].[Employee] ([employee_id])
GO
ALTER TABLE [dbo].[Employee_Criteria] CHECK CONSTRAINT [FK_Employee_Criteria_Employee]
GO
ALTER TABLE [dbo].[feedback]  WITH CHECK ADD  CONSTRAINT [FK_Note_Account] FOREIGN KEY([created_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[feedback] CHECK CONSTRAINT [FK_Note_Account]
GO
ALTER TABLE [dbo].[feedback]  WITH CHECK ADD  CONSTRAINT [FK_Note_Ranking_Decision] FOREIGN KEY([decision_id])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[feedback] CHECK CONSTRAINT [FK_Note_Ranking_Decision]
GO
ALTER TABLE [dbo].[Options]  WITH CHECK ADD  CONSTRAINT [FK__Options__created__6383C8BA] FOREIGN KEY([created_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Options] CHECK CONSTRAINT [FK__Options__created__6383C8BA]
GO
ALTER TABLE [dbo].[Options]  WITH CHECK ADD  CONSTRAINT [FK__Options__criteri__6477ECF3] FOREIGN KEY([criteria_id])
REFERENCES [dbo].[Criteria] ([criteria_id])
GO
ALTER TABLE [dbo].[Options] CHECK CONSTRAINT [FK__Options__criteri__6477ECF3]
GO
ALTER TABLE [dbo].[Ranking_Decision]  WITH CHECK ADD  CONSTRAINT [FK__Ranking_D__creat__656C112C] FOREIGN KEY([created_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Ranking_Decision] CHECK CONSTRAINT [FK__Ranking_D__creat__656C112C]
GO
ALTER TABLE [dbo].[Ranking_Decision]  WITH CHECK ADD  CONSTRAINT [FK__Ranking_D__final__66603565] FOREIGN KEY([finalized_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Ranking_Decision] CHECK CONSTRAINT [FK__Ranking_D__final__66603565]
GO
ALTER TABLE [dbo].[Ranking_Group]  WITH CHECK ADD  CONSTRAINT [FK__Ranking_G__creat__68487DD7] FOREIGN KEY([created_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Ranking_Group] CHECK CONSTRAINT [FK__Ranking_G__creat__68487DD7]
GO
ALTER TABLE [dbo].[Ranking_Group]  WITH CHECK ADD  CONSTRAINT [FK_Ranking_Group_Ranking_Decision] FOREIGN KEY([current_ranking_decision])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[Ranking_Group] CHECK CONSTRAINT [FK_Ranking_Group_Ranking_Decision]
GO
ALTER TABLE [dbo].[Ranking_Title]  WITH CHECK ADD  CONSTRAINT [FK__Ranking_T__decis__693CA210] FOREIGN KEY([decision_id])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[Ranking_Title] CHECK CONSTRAINT [FK__Ranking_T__decis__693CA210]
GO
ALTER TABLE [dbo].[Ranking_Title_Option]  WITH CHECK ADD  CONSTRAINT [FK__Ranking_T__optio__6A30C649] FOREIGN KEY([option_id])
REFERENCES [dbo].[Options] ([option_id])
GO
ALTER TABLE [dbo].[Ranking_Title_Option] CHECK CONSTRAINT [FK__Ranking_T__optio__6A30C649]
GO
ALTER TABLE [dbo].[Ranking_Title_Option]  WITH CHECK ADD  CONSTRAINT [FK__Ranking_T__ranki__6B24EA82] FOREIGN KEY([ranking_title_id])
REFERENCES [dbo].[Ranking_Title] ([ranking_title_id])
GO
ALTER TABLE [dbo].[Ranking_Title_Option] CHECK CONSTRAINT [FK__Ranking_T__ranki__6B24EA82]
GO
ALTER TABLE [dbo].[System_Log]  WITH CHECK ADD  CONSTRAINT [FK__System_Lo__accou__6C190EBB] FOREIGN KEY([account_id])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[System_Log] CHECK CONSTRAINT [FK__System_Lo__accou__6C190EBB]
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD  CONSTRAINT [FK__Task__created_by__6D0D32F4] FOREIGN KEY([created_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Task] CHECK CONSTRAINT [FK__Task__created_by__6D0D32F4]
GO
ALTER TABLE [dbo].[Task_Wages]  WITH CHECK ADD  CONSTRAINT [FK__Task_Wage__ranki__6E01572D] FOREIGN KEY([ranking_title_id])
REFERENCES [dbo].[Ranking_Title] ([ranking_title_id])
GO
ALTER TABLE [dbo].[Task_Wages] CHECK CONSTRAINT [FK__Task_Wage__ranki__6E01572D]
GO
ALTER TABLE [dbo].[Task_Wages]  WITH CHECK ADD  CONSTRAINT [FK__Task_Wage__task___6EF57B66] FOREIGN KEY([task_id])
REFERENCES [dbo].[Task] ([task_id])
GO
ALTER TABLE [dbo].[Task_Wages] CHECK CONSTRAINT [FK__Task_Wage__task___6EF57B66]
GO
