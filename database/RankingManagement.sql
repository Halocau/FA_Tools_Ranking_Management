USE [RankingManagement ]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Account](
	[account_id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](100) NOT NULL,
	[password_hash] [varchar](255) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[role] [varchar](50) NULL,
	[status] [varchar](50) NULL,
	[full_name] [varchar](100) NULL,
	[date_of_birth] [date] NULL,
	[address] [varchar](255) NULL,
	[phone_number] [varchar](20) NULL,
	[gender] [varchar](10) NULL,
	[token] [varchar](255) NULL,
	[token_expiration] [datetime] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[account_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Bulk_Ranking_History]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Bulk_Ranking_History](
	[history_id] [int] IDENTITY(1,1) NOT NULL,
	[decision_id] [int] NULL,
	[upload_at] [datetime] NULL,
	[upload_by] [int] NULL,
	[status] [varchar](50) NULL,
	[note] [text] NULL,
PRIMARY KEY CLUSTERED 
(
	[history_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Criteria]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Criteria](
	[criteria_id] [int] IDENTITY(1,1) NOT NULL,
	[criteria_name] [varchar](100) NULL,
	[max_score] [int] NULL,
	[num_options] [int] NULL,
	[created_by] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[criteria_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Decision_Criteria]    Script Date: 10/16/2024 2:42:31 PM ******/
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
/****** Object:  Table [dbo].[Decision_Tasks]    Script Date: 10/16/2024 2:42:31 PM ******/
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
/****** Object:  Table [dbo].[DecisionCriteria]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DecisionCriteria](
	[decision_id] [int] NOT NULL,
	[criteria_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[decision_id] ASC,
	[criteria_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employee]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employee](
	[employee_id] [int] IDENTITY(1,1) NOT NULL,
	[employee_name] [varchar](100) NOT NULL,
	[rank_title_id] [int] NULL,
	[bulk_import_id] [int] NULL,
	[ranking_decision_id] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[employee_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GroupEmployees]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupEmployees](
	[group_id] [int] NOT NULL,
	[employee_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[group_id] ASC,
	[employee_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Options]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Options](
	[option_id] [int] IDENTITY(1,1) NOT NULL,
	[criteria_id] [int] NULL,
	[option_name] [varchar](100) NULL,
	[score] [int] NULL,
	[description] [text] NULL,
	[created_by] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[option_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ranking_Decision]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ranking_Decision](
	[decision_id] [int] IDENTITY(1,1) NOT NULL,
	[group_id] [int] NULL,
	[decision_name] [varchar](100) NULL,
	[status] [varchar](50) NULL,
	[finalized_at] [datetime] NULL,
	[finalized_by] [int] NULL,
	[created_by] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[decision_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ranking_Group]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ranking_Group](
	[group_id] [int] IDENTITY(1,1) NOT NULL,
	[group_name] [varchar](100) NULL,
	[num_employees] [int] NULL,
	[currentRankingDecision] [int] NULL,
	[created_by] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[group_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ranking_Title]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ranking_Title](
	[ranking_title_id] [int] IDENTITY(1,1) NOT NULL,
	[decision_id] [int] NULL,
	[title_name] [varchar](100) NULL,
	[total_score] [float] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ranking_title_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ranking_Title_Option]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ranking_Title_Option](
	[ranking_title_id] [int] NOT NULL,
	[option_id] [int] NOT NULL,
	[score] [float] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ranking_title_id] ASC,
	[option_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[System_Log]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[System_Log](
	[log_id] [int] IDENTITY(1,1) NOT NULL,
	[account_id] [int] NULL,
	[action] [varchar](255) NULL,
	[log_time] [datetime] NULL,
	[ip_address] [varchar](50) NULL,
	[user_agent] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[log_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Task]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Task](
	[task_id] [int] IDENTITY(1,1) NOT NULL,
	[task_name] [varchar](100) NULL,
	[created_by] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[task_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Task_Wages]    Script Date: 10/16/2024 2:42:31 PM ******/
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
/****** Object:  Table [dbo].[TaskDecision]    Script Date: 10/16/2024 2:42:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TaskDecision](
	[task_id] [int] NOT NULL,
	[decision_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[task_id] ASC,
	[decision_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Ranking_Group] ON 

INSERT [dbo].[Ranking_Group] ([group_id], [group_name], [num_employees], [currentRankingDecision], [created_by], [created_at], [updated_at]) VALUES (1, N'Trainer', 2, 1, NULL, NULL, NULL)
INSERT [dbo].[Ranking_Group] ([group_id], [group_name], [num_employees], [currentRankingDecision], [created_by], [created_at], [updated_at]) VALUES (2, N'Support', 3, 1, NULL, NULL, NULL)
INSERT [dbo].[Ranking_Group] ([group_id], [group_name], [num_employees], [currentRankingDecision], [created_by], [created_at], [updated_at]) VALUES (3, N'Class Manager', 2, 1, NULL, NULL, NULL)
INSERT [dbo].[Ranking_Group] ([group_id], [group_name], [num_employees], [currentRankingDecision], [created_by], [created_at], [updated_at]) VALUES (4, N'Class Admin', 0, 1, NULL, NULL, NULL)
INSERT [dbo].[Ranking_Group] ([group_id], [group_name], [num_employees], [currentRankingDecision], [created_by], [created_at], [updated_at]) VALUES (5, N'Marketing Clerk', 0, 1, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[Ranking_Group] OFF
GO
ALTER TABLE [dbo].[Bulk_Ranking_History]  WITH CHECK ADD FOREIGN KEY([decision_id])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[Bulk_Ranking_History]  WITH CHECK ADD FOREIGN KEY([upload_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Criteria]  WITH CHECK ADD FOREIGN KEY([created_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Decision_Criteria]  WITH CHECK ADD FOREIGN KEY([criteria_id])
REFERENCES [dbo].[Criteria] ([criteria_id])
GO
ALTER TABLE [dbo].[Decision_Criteria]  WITH CHECK ADD FOREIGN KEY([decision_id])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[Decision_Tasks]  WITH CHECK ADD FOREIGN KEY([decision_id])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[Decision_Tasks]  WITH CHECK ADD FOREIGN KEY([task_id])
REFERENCES [dbo].[Task] ([task_id])
GO
ALTER TABLE [dbo].[DecisionCriteria]  WITH CHECK ADD FOREIGN KEY([criteria_id])
REFERENCES [dbo].[Criteria] ([criteria_id])
GO
ALTER TABLE [dbo].[DecisionCriteria]  WITH CHECK ADD FOREIGN KEY([decision_id])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[Employee]  WITH CHECK ADD FOREIGN KEY([bulk_import_id])
REFERENCES [dbo].[Bulk_Ranking_History] ([history_id])
GO
ALTER TABLE [dbo].[Employee]  WITH CHECK ADD FOREIGN KEY([rank_title_id])
REFERENCES [dbo].[Ranking_Title] ([ranking_title_id])
GO
ALTER TABLE [dbo].[Employee]  WITH CHECK ADD FOREIGN KEY([ranking_decision_id])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[GroupEmployees]  WITH CHECK ADD FOREIGN KEY([employee_id])
REFERENCES [dbo].[Employee] ([employee_id])
GO
ALTER TABLE [dbo].[GroupEmployees]  WITH CHECK ADD FOREIGN KEY([group_id])
REFERENCES [dbo].[Ranking_Group] ([group_id])
GO
ALTER TABLE [dbo].[Options]  WITH CHECK ADD FOREIGN KEY([created_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Options]  WITH CHECK ADD FOREIGN KEY([criteria_id])
REFERENCES [dbo].[Criteria] ([criteria_id])
GO
ALTER TABLE [dbo].[Ranking_Decision]  WITH CHECK ADD FOREIGN KEY([created_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Ranking_Decision]  WITH CHECK ADD FOREIGN KEY([finalized_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Ranking_Decision]  WITH CHECK ADD FOREIGN KEY([group_id])
REFERENCES [dbo].[Ranking_Group] ([group_id])
GO
ALTER TABLE [dbo].[Ranking_Group]  WITH CHECK ADD FOREIGN KEY([created_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Ranking_Title]  WITH CHECK ADD FOREIGN KEY([decision_id])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[Ranking_Title_Option]  WITH CHECK ADD FOREIGN KEY([option_id])
REFERENCES [dbo].[Options] ([option_id])
GO
ALTER TABLE [dbo].[Ranking_Title_Option]  WITH CHECK ADD FOREIGN KEY([ranking_title_id])
REFERENCES [dbo].[Ranking_Title] ([ranking_title_id])
GO
ALTER TABLE [dbo].[System_Log]  WITH CHECK ADD FOREIGN KEY([account_id])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD FOREIGN KEY([created_by])
REFERENCES [dbo].[Account] ([account_id])
GO
ALTER TABLE [dbo].[Task_Wages]  WITH CHECK ADD FOREIGN KEY([ranking_title_id])
REFERENCES [dbo].[Ranking_Title] ([ranking_title_id])
GO
ALTER TABLE [dbo].[Task_Wages]  WITH CHECK ADD FOREIGN KEY([task_id])
REFERENCES [dbo].[Task] ([task_id])
GO
ALTER TABLE [dbo].[TaskDecision]  WITH CHECK ADD FOREIGN KEY([decision_id])
REFERENCES [dbo].[Ranking_Decision] ([decision_id])
GO
ALTER TABLE [dbo].[TaskDecision]  WITH CHECK ADD FOREIGN KEY([task_id])
REFERENCES [dbo].[Task] ([task_id])
GO
